import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Item from './Item';
import './style.css';
import { v4 as uuidv4 } from 'uuid';
import { Input, Space } from 'antd';
import {
  UpCircleOutlined,
  DownCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

export default function App(props) {
  const { sectionsToSet, fieldsToSet } = props;
  const [sections, setSections] = useState(sectionsToSet);
  const [fields, setFields] = useState(fieldsToSet);

  const rearangeArr = (arr, sourceIndex, destIndex) => {
    const arrCopy = [...arr];
    const [removed] = arrCopy.splice(sourceIndex, 1);
    arrCopy.splice(destIndex, 0, removed);

    arrCopy.forEach((item, index) => (item.hoverIndex = index));
    return arrCopy;
  };

  const updateCategoryName = (index, event) => {
    const newSections = [...sections];
    newSections[index].name = event.target.value;
    setSections(newSections);
  };

  const handleHover = (index, showHover, showInputBox = false) => {
    const oldItems = [...fields];
    oldItems.forEach((entry) => (entry.hover = false));
    let data = oldItems[index];
    data = {
      ...data,
      hover: showHover,
      showInputBox: showInputBox,
    };
    oldItems[index] = data;
    setFields(oldItems);
  };

  const categoryActions = (index, type) => {
    const categoriesLength = sections.length;
    switch (type) {
      case 'up':
        if (index >= 1) {
          const newSections = [...sections];
          let tempSwap = newSections[index - 1];
          newSections[index - 1] = newSections[index];
          newSections[index] = tempSwap;
          setSections(newSections);
        }
        break;
      case 'down':
        if (index <= categoriesLength - 2) {
          const newSections = [...sections];
          let tempSwap = newSections[index + 1];
          newSections[index + 1] = newSections[index];
          newSections[index] = tempSwap;
          setSections(newSections);
        }
        break;
      case 'delete':
        if (index >= 1) {
          const currCategory = sections[index];
          const prevCategory = sections[index - 1];
          const newFields = [...fields];
          newFields.forEach((item) => {
            if (currCategory.id === item.sid) {
              item.sid = prevCategory.id;
            }
          });
          const newSections = [...sections];
          newSections.splice(index, 1);
          setSections(newSections);
          setFields(newFields);
        }
        break;
    }
  };
  const splitDataIntoCategories = (categoryToTarget, index, event) => {
    const newSections = [...sections];
    const newSectionId = uuidv4();
    newSections.push({ id: newSectionId, name: event.target.value });
    const newFields = [...fields];
    newFields.forEach((item, it) => {
      if (it <= index) {
        return;
      }
      if (item.sid === categoryToTarget) {
        item.sid = newSectionId;
      }
    });
    setFields(newFields);
    setSections(newSections);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === 'Categories') {
      // full sections moved
      setSections(rearangeArr(sections, source.index, destination.index));
    } else if (destination.droppableId !== source.droppableId) {
      // item moved between sections
      setFields((fields) =>
        fields.map((item) =>
          item.id === result.draggableId
            ? {
                ...item,
                sid: result.destination.droppableId,
              }
            : item
        )
      );
    } else {
      //item moved inside the section
      setFields(rearangeArr(fields, source.index, destination.index));
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
                {sections.map((section, index) => (
                  <Draggable
                    draggableId={`section-${section.id}`}
                    key={`section-${section.id}`}
                    index={index}
                  >
                    {(parentProvider) => (
                      <div
                        ref={parentProvider.innerRef}
                        {...parentProvider.draggableProps}
                      >
                        <Droppable droppableId={section?.id?.toString()}>
                          {(provided, i) => (
                            <div ref={provided.innerRef}>
                              <ul className="list-unstyled p-3 mb-3">
                                {/* Category title is the drag handle for a section */}
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
                                    value={section.name}
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
                                {fields
                                  .filter((item) => item.sid === section.id)
                                  .map((item, index) => (
                                    <>
                                      <Draggable
                                        draggableId={item?.id?.toString()}
                                        key={item.id}
                                        index={item.hoverIndex}
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
                                                  item.sid,
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
