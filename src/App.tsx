import { Button, Checkbox, Col, Input, Row, Table } from "antd"
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { ColumnsType } from 'antd/es/table';
import { useState } from "react";
import { ITodoItem } from "./assets/typings"


function App() {
  const [dataSource, setDataSource] = useState<ITodoItem[]>([])
  const [content, setContent] = useState<string>('')
  const addTodo = () => {
    if (!content.trim()) return;
    const todoItem: ITodoItem = {
      id: new Date().getTime(),
      content: content,
      complete: false
    }
    setDataSource(() => [...dataSource, todoItem])
    setContent('')
  }
  const changeTodo = (e: CheckboxChangeEvent, text: ITodoItem) => {
    setDataSource(() => {
      return dataSource.map(item => {
        if (item.id === text.id) {
          item.complete = e.target.checked
        }
        return item
      })
    })
  }
  const delTodo = (text: ITodoItem) => {
    setDataSource(dataSource.filter(item => item.id !== text.id))
  }
  const editTodo = (text: ITodoItem) => {
    setContent(text.content)
    delTodo(text)
  }
  const columns: ColumnsType<ITodoItem> = [
    {
      title: 'id',
      dataIndex: 'id'
    },
    {
      title: '待办事项',
      dataIndex: 'content',
      render: (text, record) => (
        <span style={record.complete ? { textDecoration: 'line-through' } : {}}>{record.content}</span>
      )
    },
    {
      title: '操作',
      key: 'operate',
      render: (text) => (
        <>
          <Checkbox checked={text.complete} onChange={(e) => changeTodo(e, text)}>完成</Checkbox>
          <Button type="link" size="small" onClick={() => editTodo(text)}>编辑</Button>
          <Button type="link" size="small" danger onClick={() => delTodo(text)}>删除</Button>
        </>
      )
    }
  ]
  return (
    <>
      <Row justify="center">
        <Col span={6} style={{ textAlign: "center" }}>To Do List</Col>
      </Row >
      <Row justify="center" style={{ marginBottom: "10px" }}>
        <Col span={5}>
          <Input size="small" placeholder="添加待办" onChange={e => setContent(e.target.value)} value={content} />
        </Col>
        <Col span={1}>
          <Button type="primary" size="small" onClick={addTodo} style={{ width: '100%' }}>添加</Button>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={6}>
          <Table rowKey="id" columns={columns} dataSource={dataSource} bordered />
        </Col>
      </Row>
    </>
  )
}

export default App
