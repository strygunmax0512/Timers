import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {timer} from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy {

  times: Subscription;
  ticks = 0;
  seconds = 0;
  minutes = 0;
  hour = 0;
  doubleClick = 0;
  timeDoubleClick = 0;
  isActiveTimer = false;

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
    if (this.doubleClick < 1) {
      this.doubleClick++;
      this.timeDoubleClick = new Date().getTime();
    } else {
      if (new Date().getTime() - this.timeDoubleClick < 300) {
        this.times.unsubscribe();
        this.doubleClick = 0;
        this.isActiveTimer = false;
      } else {
        this.doubleClick = 0;
      }
    }
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
