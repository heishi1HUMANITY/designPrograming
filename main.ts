const faceapi = require('face-api.js');
const canvas = require('canvas');
const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, './uploads/');
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, 'tmp.jpg');
    }
  })
});
const app = express();
const getParam = async (): Promise<any> => {
  const c = canvas.createCanvas(160, 120);
  const ctx = c.getContext('2d');
  const img = await canvas.loadImage(path.join(__dirname, 'uploads', 'tmp.jpg'));
  ctx.drawImage(img, 0, 0, 160, 120);
  const d = await faceapi.detectSingleFace(c).withFaceExpressions();
  return d;
};
const max = (obj: object): [string, number] => {
  let max: [string, number] = ['', -Infinity]
  for (const [key, value] of Object.entries(obj)) {
    if (max[1] <= value) max = [key, value];
  }
  console.log(max);
  return max;
}

app.post('/api/dp/', upload.any(), (req: Express.Request, res: any): void => {
  (async () => {
    const p = await getParam();
    if (p !== null) res.send(max(p.expressions)[0]);
    else res.end();
  })()
    .catch(err => {
      res.status(418);
      res.send(err);
    })
});

app.listen(3000, () => console.log('server is working at localhost:3000'));

(() => {
  const { Canvas, Image, ImageData } = canvas;
  faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
  Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, 'weights')),
    faceapi.nets.faceExpressionNet.loadFromDisk(path.join(__dirname, 'weights'))
  ])
  console.log('faceapi is ready');
})();