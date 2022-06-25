const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
var pitch;
var mic;
var freq = 0;
var threshold = 1;
var audioContext;
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
function start(){
  audioContext.resume();
}
function setup() {
  createCanvas(400, 400);
  audioContext = getAudioContext();
  downloadButton = createButton('Start');
  downloadButton.position(1150,700).size(100,40).style('background-color', 'rgb(255, 0, 0)');
  downloadButton.style('border','none');
  downloadButton.style('border-radius', '10px');
  downloadButton.mousePressed(function() {
    start();
  });
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

function draw() {
  background(0);
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(32);
  text(freq.toFixed(2), width / 2, height - 150);
  let closestNote = -1;
  let recordDiff = Infinity;
  for (let i = 0; i < notes.length; i++) {
    let diff = freq - notes[i].freq;
    if (abs(diff) < abs(recordDiff)) {
      closestNote = notes[i];
      recordDiff = diff;
    }
  }
  textSize(64);
  text(closestNote.note, width / 2, height - 50);
  let diff = recordDiff;
  let alpha = map(abs(diff), 0, 100, 255, 0);
  rectMode(CENTER);
  fill(255, alpha);
  stroke(255);
  strokeWeight(1);
  if (abs(diff) < threshold) {
    fill(0, 255, 0);
  }
  rect(200, 100, 200, 50);
  stroke(255);
  strokeWeight(4);
  line(200, 0, 200, 200);
  noStroke();
  fill(255, 0, 0);
  if (abs(diff) < threshold) {
    fill(0, 255, 0);
  }
  rect(200 + diff / 2, 100, 10, 75);
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