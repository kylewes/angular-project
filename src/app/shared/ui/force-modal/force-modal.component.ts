import { Component, EventEmitter, Output, } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-force-modal',
  imports: [FormsModule],
  templateUrl: './force-modal.component.html',
  styleUrl: './force-modal.component.css'
})
export class ForceModalComponent {
  forceName: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{name: string}>();

  onSave() {
    if (this.forceName.trim()) {
      this.save.emit({ name: this.forceName });
      this.forceName = '';
    }
  }

  onClose() {
    this.close.emit();
  }
}
