import {Component, OnDestroy} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {timer} from 'rxjs';
import {bufferCount, filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy {

  times: Subscription;
  isActiveTimer = false;
  ticks = 0;
  seconds = 0;
  minutes = 0;
  hour = 0;

  tess = 0;

  ngOnDestroy(): void {
    this.times.unsubscribe();
  }

  startTimer(): void {
    this.isActiveTimer = true;
    timer(1000).subscribe(() => {
      const period = timer(1, 1000);
      this.times = period.subscribe(() => {
        this.initialTimer(this.ticks += 1);
      });
    });
  }

  stopTimer(): void {
    this.ticks = 0;
    this.initialTimer(0);
    this.isActiveTimer = false;
    this.times.unsubscribe();
  }

  waitTimer(): void {
    fromEvent(document.querySelector('.wait'), 'click').pipe(
      map(() => new Date().getTime()),
      bufferCount(2, 1),
      filter((timestamps) => {
        return timestamps[0] > new Date().getTime() - 300;
      })).subscribe(() => {
      this.times.unsubscribe();
      this.isActiveTimer = false;
    });
  }

  private initialTimer(ticks: number): void {
    this.seconds = this.getSeconds(ticks);
    this.minutes = this.getMinutes(ticks);
    this.hour = this.getHours(ticks);
  }

  private getSeconds(ticks: number): number {
    return this.pad(ticks % 60);
  }

  private getMinutes(ticks: number): number {
    return this.pad((Math.floor(ticks / 60)) % 60);
  }

  private getHours(ticks: number): number {
    return this.pad(Math.floor((ticks / 60) / 60));
  }

  private pad(col: number): any {
    return col < 10 ? '0' + col : col;
  }

}
