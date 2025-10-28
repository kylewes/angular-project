import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-unit-modal',
  imports: [FormsModule],
  templateUrl: './unit-modal.component.html',
  styleUrl: './unit-modal.component.css'
})
export class UnitModalComponent {
  unitName: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ name: string }>();

  onSave() {
    if (this.unitName.trim()) {
      this.save.emit({ name: this.unitName });
      this.unitName = '';
    }
  }

  onClose() {
    this.close.emit();
  }
}
