import React from "react";
import Sketch from "react-p5";
import * as p5 from "p5"
import * as ml5 from "ml5"
import "p5/lib/addons/p5.sound"

window.p5 = p5
const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
var pitch, audioContext, mic;
var freq = 0;
var threshold = 1;
var notes = [{
    note: 'E',
    freq: 82.41
  },
  {
    note: 'A',
    freq: 110.00
  },
  {
    note: 'D',
    freq: 146.83
  },
  {
    note: 'G',
    freq: 196.00
  },
 {
    note: 'B',
    freq: 246.94
  },
  {
    note: 'E4',
    freq: 329.63
  },
];


const TunerGuitar = (props) => {
    function setup(p5) {
        p5.createCanvas(400, 400);
        audioContext = p5.getAudioContext();
        mic = new p5.AudioIn();
        mic.start(listening);
    }
    
    function listening() {
    console.log('listening');
    pitch = ml5.pitchDetection(
        model_url,
        audioContext,
        mic.stream,
        modelLoaded
    );
    }
    function modelLoaded() {
        console.log('model loaded');
        pitch.getPitch(gotPitch);
    }
    
    function gotPitch(error, frequency) {
        if (error) {
        console.error(error);
        } else {
        //console.log(frequency);
        if (frequency) {
            freq = frequency;
        }
        pitch.getPitch(gotPitch);
        }
    }
    function draw() {
        p5.background(0);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.fill(255);
        p5.textSize(32);
        p5.text(freq.toFixed(2), p5.width / 2, p5.height - 150);
        let closestNote = -1;
        let recordDiff = Infinity;
        for (let i = 0; i < notes.length; i++) {
          let diff = freq - notes[i].freq;
          if (p5.abs(diff) < p5.abs(recordDiff)) {
            closestNote = notes[i];
            recordDiff = diff;
          }
        }
        p5.textSize(64);
        p5.text(closestNote.note, p5.width / 2, p5.height - 50);
        let diff = recordDiff;
        let alpha = p5.map(p5.abs(diff), 0, 100, 255, 0);
        p5.rectMode(p5.CENTER);
        p5.fill(255, alpha);
        p5.stroke(255);
        p5.strokeWeight(1);
        if (p5.abs(diff) < threshold) {
            p5.fill(0, 255, 0);
        }
        p5.rect(200, 100, 200, 50);

        p5.stroke(255);
        p5.strokeWeight(4);
        p5.line(200, 0, 200, 200);
        p5.noStroke();
        p5.fill(255, 0, 0);
        if (p5.abs(diff) < threshold) {
            p5.fill(0, 255, 0);
        }
        p5.rect(200 + diff / 2, 100, 10, 75);
    }
    return (
        <>
          <Sketch setup={setup} draw={draw} />
        </>
      );
}

export default TunerGuitar;