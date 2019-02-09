import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
 } from '@angular/fire/firestore';
 import { map } from 'rxjs/operators';

 import { Event } from './shared/model/event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Adjust schedule';
  eventCollection: AngularFirestoreCollection<Event>;
  events: Event[];

  event: Event = { title: '' };

  constructor(public db: AngularFirestore) { }

  ngOnInit() {
    // とりあえず全件取得
    this.eventCollection = this.db.collection<Event>('events', ref => ref);

    // 変更があればデータを更新する
    const eventsObservable = this.eventCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
    eventsObservable.subscribe(events => this.events = events);
  }

  add() {
    this.eventCollection.add(this.event);

    // バインドしてる項目を消す
    this.event = { title: '' };
  }

  remove(id: string) {
    this.eventCollection.doc(id).delete();
  }

}
