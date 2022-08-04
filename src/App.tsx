import { Button, Checkbox, Col, Input, message, Row, Table, Popconfirm, Tooltip } from "antd"
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from "react";
import { ITodoItem } from "./assets/typings"


function App() {
  const [dataSource, setDataSource] = useState<ITodoItem[]>(JSON.parse(localStorage.getItem('dataSource') || '[]'));
  const [content, setContent] = useState<string>('')
  useEffect(() => {
    localStorage.setItem('dataSource', JSON.stringify(dataSource))
  }, [dataSource])
  const getCurrentTime = (): string => {
    return new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
  }
  const addTodo = () => {
    if (!content.trim()) {
      message.error('待办不能为空!')
      return;
    };
    if (dataSource.find(item => item.content === content)) {
      message.error('待办不能重复!')
      return;
    }
    const todoItem: ITodoItem = {
      id: new Date().getTime(),
      content: content,
      complete: false,
      createTime: getCurrentTime()
    }
    setDataSource(() => [todoItem, ...dataSource])
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
      dataIndex: 'id',
      ellipsis: true,
      width: 120,
    },
    {
      title: '待办事项',
      key: 'content',
      ellipsis: true,
      width: 150,
      render: (text) => (
        <Tooltip placement="top" title={text.content}>
          <span style={text.complete ? { textDecoration: 'line-through' } : {}}>{text.content}</span>
        </Tooltip>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
    {
      title: '操作',
      key: 'operate',
      render: (text) => (
        <>
          <Checkbox checked={text.complete} onChange={(e) => changeTodo(e, text)}>完成</Checkbox>
          <Button type="link" size="small" onClick={() => editTodo(text)}>编辑</Button>
          <Popconfirm
            title="确定删除该待办吗?"
            onConfirm={() => delTodo(text)}
            okText="删除"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </>
      )
    }
  ]
  return (
    <>
      <Row justify="center">
        <Col span={8} style={{ textAlign: "center" }}>To Do List</Col>
      </Row >
      <Row justify="center" style={{ marginBottom: "10px" }}>
        <Col span={7}>
          <Input size="small" placeholder="添加待办" allowClear onPressEnter={addTodo} onChange={e => setContent(e.target.value)} value={content} />
        </Col>
        <Col span={1}>
          <Button type="primary" size="small" onClick={addTodo} style={{ width: '100%' }}>添加</Button>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={8}>
          <Table size="small" rowKey="id" columns={columns} dataSource={dataSource} bordered pagination={{ pageSize: 5 }} />
        </Col>
      </Row>
    </>
  )
}

export default App
