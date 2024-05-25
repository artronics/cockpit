#!/usr/bin/env python3
import random
import string


# This script generates a file with randomly generated words, for typing practice.

def gen():
    # Define the weights for each symbol
    symbol_weights = {
        '|': 0.4, '-': 0.8, '!': 0.5, '*': 0.8, '=': 0.9, '_': 1.0, '~': 0.6, '$': 0.5, '^': 0.4, '&': 0.6, '#': 0.5,
        '@': 0.9,
        '`': 0.8, '%': 0.5,
        '""': 0.9, "''": 0.8, '[]': 0.9, '{}': 0.9, '()': 1.0,

    }
    # All letters have the same weight
    letter_weights = {letter: 1.0 for letter in string.ascii_letters.lower()}
    # B is harder to type with split keyboard
    letter_weights['b'] = 2.0

    all_chs = {**symbol_weights, **letter_weights}

    def generate_word():
        # Start with a random letter
        word = random.choice(string.ascii_letters.upper())

        for _ in range(random.randint(2, 6)):
            symbol = random.choices(list(all_chs.keys()), weights=all_chs.values(), k=1)[0]
            word += symbol

        return word

    # Generate 50 lines of text
    text = ''
    for _ in range(50):
        text += ' '.join(generate_word() for _ in range(random.randint(10, 40)))
        text += '\n'

    return text


if __name__ == '__main__':
    t = gen()
    with open('../out/words.txt', 'w') as f:
        f.write(t)
