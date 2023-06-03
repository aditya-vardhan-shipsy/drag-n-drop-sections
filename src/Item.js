import React from 'react';

export default function Item({ item }) {
  return (
    <div>
      {item.id} {item.name}
    </div>
  );
}
