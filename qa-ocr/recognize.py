import cv2
import re
import json
import pytesseract
import argparse
import editdistance

def get_text_at_second(cap, t):
  cap.set(cv2.CAP_PROP_POS_MSEC, 1000 * t)
  ret, frame = cap.read()
  img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

  return pytesseract.image_to_string(img_rgb)

def is_same_noisy_text(a, b):
  return editdistance.distance(a.lower(), b.lower()) < 3

def process(file):
  cap = cv2.VideoCapture(file)

  fps = cap.get(cv2.CAP_PROP_FPS) # https://stackoverflow.com/a/52032374
  frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
  duration = frame_count / fps

  t = 0

  current_text = ''
  new_text = ''


  texts = []

  current_text = get_text_at_second(cap, 0)
  current_text_start_pos = 0

  times = list(range(1, int(duration), 30))
  times += list(range(times[-1] + 1, int(duration)))

  for t in range(1, int(duration), 30):
    text = get_text_at_second(cap, t)

    if is_same_noisy_text(text, current_text):
      # same 'slide'
      continue


    found = False

    for j in range(t, current_text_start_pos, -1):
      temp_text = get_text_at_second(cap, j)

      if is_same_noisy_text(temp_text, current_text):
        current_text = text
        current_text_start_pos = j
        texts.append((j, text))
        found = True
        break

    if not found:
      print('ERROR: NOT FOUND', t, text)
      break

  return texts

with open('./todo.txt') as f:
  todo = f.read().split('\n')

for file in todo:
  if not file:
    continue

  print('Processing', file)

  try:
    texts = process(file)
    with open(file + '.transc.txt', 'w') as f:
      f.write(json.dumps(texts))
  except Exception as e:
    print("ERROR", file)
    print(e)
