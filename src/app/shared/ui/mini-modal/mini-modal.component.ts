import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mini-modal',
  imports: [FormsModule],
  templateUrl: './mini-modal.component.html',
  styleUrl: './mini-modal.component.css'
})
export class MiniModalComponent {
   miniName: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ name: string }>();

  onSave() {
    if (this.miniName.trim()) {
      this.save.emit({ name: this.miniName });
      this.miniName = '';
    }
  }

  onClose() {
    this.close.emit();
  }
}
