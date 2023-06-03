import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import App from './App';

const key = uuidv4();
const sections = [{ id: key, name: 'Catergory 1' }];
const fields = [
  {
    id: 'a',
    name: 'item1',
    sid: key,
    hover: false,
    hoverIndex: 0,
    showInputBox: false,
  },
  {
    id: 'b',
    name: 'item2',
    sid: key,
    hover: false,
    hoverIndex: 1,
    showInputBox: false,
  },
  {
    id: 'c',
    name: 'item3',
    sid: key,
    hover: false,
    hoverIndex: 2,
    showInputBox: false,
  },
  {
    id: 'd',
    name: 'item4',
    sid: key,
    hover: false,
    hoverIndex: 3,
    showInputBox: false,
  },
  {
    id: 'e',
    name: 'item5',
    sid: key,
    hover: false,
    hoverIndex: 4,
    showInputBox: false,
  },
  {
    id: 'f',
    name: 'item6',
    sid: key,
    hover: false,
    hoverIndex: 5,
    showInputBox: false,
  },
];

export default function Main() {
  return (
    <div>
      <App fieldsToSet={fields} sectionsToSet={sections} />
    </div>
  );
}
