import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment, CommentService } from '../../services/comments.service';
import { Card, CardService } from '../../services/cards.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../services/user.service';
import { CardComponent } from '../card/card.component';
import { ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent implements OnInit {
  constructor(private commentService: CommentService) {}

  @Input()
  comment!: Comment;
  @Input()
  username!: string;
  isTextAreaFocused: boolean = false;
  @Output() rmComment = new EventEmitter<any>();
  @ViewChild('commentContent', { static: false }) commentContent!: ElementRef;

  ngOnInit() {}
  removeComment() {
    // Envoie la comment à supprimer au composant parent en déclenchant un event car impossible de mettre à jour
    // l'affichage des comments depuis ce composant. Je peux le supprimer en bdd mais pas mettre à jour l'affichage
    // sans recharger la page.
    this.rmComment.emit(this.comment);
  }
  formaterTimestamp() {
    let date = new Date(this.comment.createdAt);
    let jour = date.getDate().toString().padStart(2, '0');
    let mois = (date.getMonth() + 1).toString().padStart(2, '0'); // Janvier = 0
    let annee = date.getFullYear();
    let heures = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    // let secondes = date.getSeconds().toString().padStart(2, '0');

    return `${jour}/${mois}/${annee} ${heures}:${minutes}`;
  }
  updateComment() {
    this.commentService.updateComment(this.comment).subscribe(() => {});
  }
  onTextAreaClick() {
    this.isTextAreaFocused = true;
    this.adjustTextAreaHeight();
  }

  onTextAreaBlur() {
    this.isTextAreaFocused = false;
    this.adjustTextAreaHeight();
  }
  private adjustTextAreaHeight() {
    const textarea = this.commentContent.nativeElement as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
