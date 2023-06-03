import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Item from './Item';
import './style.css';
import { Input, Space } from 'antd';
import {
  UpCircleOutlined,
  DownCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

export default function App() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Catergory 1' },
  ]);
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'item1',
      category: 1,
      hover: false,
      hoverIndex: 0,
      showInputBox: false,
    },
    {
      id: 2,
      name: 'item2',
      category: 1,
      hover: false,
      hoverIndex: 1,
      showInputBox: false,
    },
    {
      id: 3,
      name: 'item3',
      category: 1,
      hover: false,
      hoverIndex: 2,
      showInputBox: false,
    },
    {
      id: 4,
      name: 'item4',
      category: 1,
      hover: false,
      hoverIndex: 3,
      showInputBox: false,
    },
    {
      id: 5,
      name: 'item5',
      category: 1,
      hover: false,
      hoverIndex: 4,
      showInputBox: false,
    },
    {
      id: 6,
      name: 'item6',
      category: 1,
      hover: false,
      hoverIndex: 5,
      showInputBox: false,
    },
  ]);

  const rearangeArr = (arr, sourceIndex, destIndex) => {
    const arrCopy = [...arr];
    const [removed] = arrCopy.splice(sourceIndex, 1);
    arrCopy.splice(destIndex, 0, removed);

    arrCopy.forEach((item, index) => (item.hoverIndex = index));
    return arrCopy;
  };

  const updateCategoryName = (index, event) => {
    const newCategories = [...categories];
    newCategories[index].name = event.target.value;
    setCategories(newCategories);
  };

  const handleHover = (index, showHover, showInputBox = false) => {
    const oldItems = [...items];
    oldItems.forEach((entry) => (entry.hover = false));
    let data = oldItems[index];
    data = {
      ...data,
      hover: showHover,
      showInputBox: showInputBox,
    };
    oldItems[index] = data;
    setItems(oldItems);
  };

  const categoryActions = (index, type) => {
    const categoriesLength = categories.length;
    switch (type) {
      case 'up':
        if (index >= 1) {
          const newCategories = [...categories];
          let tempSwap = newCategories[index - 1];
          newCategories[index - 1] = newCategories[index];
          newCategories[index] = tempSwap;
          setCategories(newCategories);
        }
        break;
      case 'down':
        if (index <= categoriesLength - 2) {
          const newCategories = [...categories];
          let tempSwap = newCategories[index + 1];
          newCategories[index + 1] = newCategories[index];
          newCategories[index] = tempSwap;
          setCategories(newCategories);
        }
        break;
      case 'delete':
        if (index >= 1) {
          const currCategory = categories[index];
          const newItems = [...items];
          newItems.forEach((item) => {
            if (currCategory.id === item.category) {
              item.category = item.category - 1;
            }
          });
          console.log(newItems);
          const newCategories = [...categories];
          const splicedNewCategories = newCategories.splice(index, 1);
          console.log(splicedNewCategories);
          setCategories(splicedNewCategories);
          setItems(newItems);
        }
        break;
    }
  };
  const splitDataIntoCategories = (categoryToTarget, index, event) => {
    const newCategories = [...categories];
    const newCategoryIndex = newCategories.length + 1;
    newCategories.push({ id: newCategoryIndex, name: event.target.value });
    const newItems = [...items];
    newItems.forEach((item, it) => {
      if (it <= index) {
        return;
      }
      if (item.category === categoryToTarget) {
        item.category = newCategoryIndex;
      }
    });
    console.log(newItems);
    console.log(newCategories);
    setItems(newItems);
    setCategories(newCategories);
  };

  const onDragEnd = (result) => {
    console.log(result);
    // object destructuring - https://www.w3schools.com/react/react_es6_destructuring.asp
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === 'Categories') {
      // a category was moved
      setCategories(rearangeArr(categories, source.index, destination.index));
    } else if (destination.droppableId !== source.droppableId) {
      // find the source in items array and change with destination droppable id
      setItems((items) =>
        items.map((item) =>
          item.id === parseInt(result.draggableId)
            ? {
                ...item,
                category: parseInt(result.destination.droppableId),
              }
            : item
        )
      );
    } else {
      // rearange the array if it is in the same category

      setItems(rearangeArr(items, source.index, destination.index));
    }
  };

  return (
    <div className="container py-5">
      <DragDropContext onDragEnd={onDragEnd}>
        <div>
          {/* type="droppable" is very important here. Look at the docs. */}
          <Droppable droppableId="Categories" type="droppableItem">
            {(provided) => (
              <div ref={provided.innerRef}>
                {categories.map((category, index) => (
                  <Draggable
                    draggableId={`category-${category.id}`}
                    key={`category-${category.id}`}
                    index={index}
                  >
                    {(parentProvider) => (
                      <div
                        ref={parentProvider.innerRef}
                        {...parentProvider.draggableProps}
                      >
                        <Droppable droppableId={category?.id?.toString()}>
                          {(provided, i) => (
                            <div ref={provided.innerRef}>
                              <ul className="list-unstyled p-3 mb-3">
                                {/* Category title is the drag handle for a category */}
                                <div
                                  {...parentProvider.dragHandleProps}
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <hr
                                    style={{
                                      flexGrow: 1,
                                      broder: 'none',
                                      borderTop: '1px solid black',
                                    }}
                                  />
                                  <Input
                                    style={{
                                      width: '400px',
                                      borderRadius: '20px',
                                      textAlign: 'center',
                                    }}
                                    onChange={(event) =>
                                      updateCategoryName(index, event)
                                    }
                                    type="text"
                                    value={category.name}
                                  />
                                  <div
                                    style={{
                                      flexGrow: 1,
                                      display: 'flex',
                                      flexDirection: 'row',
                                      justifyContent: 'flex-start',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <hr
                                      style={{
                                        flexGrow: 1,
                                        broder: 'none',
                                        borderTop: '1px solid black',
                                      }}
                                    />
                                    <UpCircleOutlined
                                      onClick={() =>
                                        categoryActions(index, 'up')
                                      }
                                      style={{
                                        marginTop: '7px',
                                      }}
                                    />
                                    <hr
                                      style={{
                                        width: '20px',
                                      }}
                                    />
                                    <DownCircleOutlined
                                      onClick={() =>
                                        categoryActions(index, 'down')
                                      }
                                      style={{
                                        marginTop: '7px',
                                      }}
                                    />
                                    <hr
                                      style={{
                                        width: '20px',
                                      }}
                                    />
                                    <MinusCircleOutlined
                                      onClick={() =>
                                        categoryActions(index, 'delete')
                                      }
                                      style={{
                                        marginTop: '7px',
                                      }}
                                    />
                                  </div>
                                </div>
                                {items
                                  .filter(
                                    (item) => item.category === category.id
                                  )
                                  .map((item, index) => (
                                    <>
                                      <Draggable
                                        draggableId={item?.id?.toString()}
                                        key={item.id}
                                        index={index}
                                      >
                                        {(provided) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                          >
                                            <li
                                              style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'between',
                                                borderBottom:
                                                  '1px solid #D3D3D3',
                                                padding: '5px',
                                              }}
                                            >
                                              <Item item={item} />
                                            </li>
                                          </div>
                                        )}
                                      </Draggable>
                                      <div
                                        onMouseEnter={() =>
                                          handleHover(item.hoverIndex, true)
                                        }
                                        onMouseLeave={() =>
                                          handleHover(item.hoverIndex, false)
                                        }
                                      >
                                        {item.hover ? (
                                          <div
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                            }}
                                          >
                                            <hr
                                              style={{
                                                flexGrow: 1,
                                                broder: 'none',
                                                borderTop: '1px solid black',
                                              }}
                                            />
                                            <p
                                              style={{
                                                margin: '0 10px',
                                                display: item.showInputBox
                                                  ? 'none'
                                                  : 'block',
                                                fontSize: '12px',
                                              }}
                                              onClick={() =>
                                                handleHover(
                                                  item.hoverIndex,
                                                  true,
                                                  true
                                                )
                                              }
                                            >
                                              Click Here To Add Section
                                            </p>
                                            <Input
                                              style={{
                                                margin: '0 10px',
                                                width: '200px',
                                                borderRadius: '20px',
                                                textAlign: 'center',
                                                display: item.showInputBox
                                                  ? 'block'
                                                  : 'none',
                                              }}
                                              onPressEnter={(event) =>
                                                splitDataIntoCategories(
                                                  item.category,
                                                  item.hoverIndex,
                                                  event
                                                )
                                              }
                                              type="text"
                                            />
                                            <hr
                                              style={{
                                                flexGrow: 1,
                                                broder: 'none',
                                                borderTop: '1px solid black',
                                              }}
                                            />
                                          </div>
                                        ) : (
                                          <p style={{ height: '5px' }}></p>
                                        )}
                                      </div>
                                    </>
                                  ))}
                                {provided.placeholder}
                              </ul>
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
}
