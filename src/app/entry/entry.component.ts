import {Component, OnInit} from '@angular/core';
import {Result} from "./result";
import * as p5 from 'p5';

declare let ml5: any;

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {
  public doodle;
  public doodleReady = false;
  public doodleCanvas;
  public firstClassification: Result;
  public secondClassification: Result;

  constructor() {
  }

  public ngOnInit(): void {
    const sketch = (sketch) => {
      sketch.setup = () => {
        sketch.createCanvas(280, 280);
        sketch.background(255);
      };

      sketch.preload = () => {
        this.doodle = ml5.imageClassifier('DoodleNet', () => {
          this.doodleReady = this.doodle.ready;
        });
      }

      sketch.draw = () => {
        if (sketch.mouseIsPressed) {
          sketch.strokeWeight(15);
          sketch.stroke(0);
          if (sketch.mouseButton === sketch.LEFT) {
            sketch.line(sketch.mouseX, sketch.mouseY, sketch.pmouseX, sketch.pmouseY);
          } else if (sketch.mouseButton === sketch.CENTER) {
            sketch.background(255);
          }
          this.classifyDoodle();
        }
      };
    };

    this.doodleCanvas = new p5(sketch);
  }


  public classifyDoodle(): void {
    if (this.doodleReady) {
      this.doodle.classify(this.doodleCanvas, (err, results) => {
        this.results(err, results);
      });
    }
  }

  public erase(): void {
    this.doodleCanvas.background(255);
    this.firstClassification.label = '';
  }

  public results(err, results): void {
    if (err) {
      console.log(err);
    }

    this.firstClassification = {
      label: results[0].label,
      confidence: this.doodleCanvas.nf(100 * results[0].confidence, 2, 1)
    }
    this.secondClassification = {
      label: results[1].label,
      confidence: this.doodleCanvas.nf(100 * results[1].confidence, 2, 1)
    }
  }

}
