'use strict';

class Queue {
    constructor() {
        this.elements = [];
    }

    // Додавання елемента до черги
    enqueue(element) {
        this.elements.push(element);
    }

    // Видалення елемента з черги та повернення його значення
    dequeue() {
        return this.elements.shift();
    }

    // Перевірка, чи черга порожня
    isEmpty() {
        return this.elements.length === 0;
    }
}

class Stack {
    constructor() {
        this.items = [];
    }

    push(element) {
        this.items.push(element);
    }

    pop() {
        return this.items.pop();
    }

    peek() {
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

export {Queue, Stack};