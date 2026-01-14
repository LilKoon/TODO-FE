import React, { useState, useEffect } from "react";
import { Table, Modal, Input, DatePicker, Select, Button, Tag, message, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, FilterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";

interface TodoItem {
  id: number;
  title: string;
  deadline: string | null;
  completed: boolean;
  completedAt: string | null;
}

const TodoApp = () => {
  const [danhSachTodo, setDanhSachTodo] = useState<TodoItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("danhSachTodo");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("danhSachTodo", JSON.stringify(danhSachTodo));
  }, [danhSachTodo]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDeadline, setFormDeadline] = useState<dayjs.Dayjs | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormTitle("");
    setFormDeadline(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setFormTitle(todo.title);
    setFormDeadline(todo.deadline ? dayjs(todo.deadline) : null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formTitle.trim()) {
      message.warning("Vui lòng nhập nội dung công việc!");
      return;
    }

    const deadlineStr = formDeadline ? formDeadline.toISOString() : null;

    if (editingId) {
      const updated = danhSachTodo.map(t =>
        t.id === editingId ? { ...t, title: formTitle, deadline: deadlineStr } : t
      );
      setDanhSachTodo(updated);
      message.success("Cập nhật thành công!");
    } else {
      const maxId = danhSachTodo.length > 0 ? Math.max(...danhSachTodo.map(t => t.id)) : 0;
      const newTodo: TodoItem = {
        id: maxId + 1,
        title: formTitle,
        deadline: deadlineStr,
        completed: false,
        completedAt: null
      };
      setDanhSachTodo([newTodo, ...danhSachTodo]);
      message.success("Thêm mới thành công!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    const filtered = danhSachTodo.filter(t => t.id !== id);
    setDanhSachTodo(filtered);
    message.success("Đã xóa công việc");
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    const updated = danhSachTodo.map(t => {
      if (t.id === id) {
        return {
          ...t,
          completed: checked,
          completedAt: checked ? new Date().toISOString() : null
        };
      }
      return t;
    });
    setDanhSachTodo(updated);
  };

  const getFilteredData = () => {
    let data = [...danhSachTodo];

    if (searchKeyword) {
      data = data.filter(t => t.title.toLowerCase().includes(searchKeyword.toLowerCase()));
    }

    const now = new Date();
    data = data.filter(todo => {
      let deadlineDate = todo.deadline ? new Date(todo.deadline) : null;
      if (deadlineDate) deadlineDate.setHours(23, 59, 59, 999);

      if (filterStatus === "all") return true;
      if (filterStatus === "active") return !todo.completed;
      if (filterStatus === "completed") return todo.completed;
      if (filterStatus === "late") return !todo.completed && deadlineDate && deadlineDate < now;
      return true;
    });

    return data;
  };

  const renderStatus = (deadline: string | null, completedAt: string | null) => {
    if (completedAt) {
      if (!deadline) return <Tag color="success">Đã hoàn thành</Tag>;
      const deadlineDate = new Date(deadline);
      deadlineDate.setHours(23, 59, 59, 999);
      const finishedDate = new Date(completedAt);
      const diffTime = finishedDate.getTime() - deadlineDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) return <Tag color="success">Đã hoàn thành</Tag>;
      return <Tag color="warning">Muộn {diffDays} ngày</Tag>;
    }

    if (!deadline) return <Tag>Không có hạn</Tag>;

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(23, 59, 59, 999);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0) return <Tag color="processing">Còn {diffDays} ngày</Tag>;
    return <Tag color="error">Quá hạn {Math.abs(diffDays)} ngày</Tag>;
  };

  const columns: ColumnsType<TodoItem> = [
    {
      title: '#',
      dataIndex: 'id',
      width: 60,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Status',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <input
          type="checkbox"
          checked={record.completed}
          onChange={(e) => handleCheckboxChange(record.id, e.target.checked)}
          className="w-5 h-5 accent-green-600 cursor-pointer"
        />
      )
    },
    {
      title: 'Task Title',
      dataIndex: 'title',
      render: (text, record) => (
        <span className={record.completed ? "line-through text-gray-400" : "font-medium"}>{text}</span>
      )
    },
    {
      title: 'Due / Completed',
      width: 200,
      render: (_, record) => renderStatus(record.deadline, record.completedAt)
    },
    {
      title: 'Action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Tooltip title="Sửa">
            <Button icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} />
          </Tooltip>
          <Popconfirm title="Xóa task này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      )
    }
  ];

  const totalTasks = danhSachTodo.length;
  const completedTasks = danhSachTodo.filter(t => t.completed).length;
  const inProgressTasks = totalTasks - completedTasks;

  return (
    <>
      <header className="flex sticky top-0 z-10 bg-white justify-between items-center border-b border-gray-200 px-10 h-18 shadow-sm">
        <div className="flex gap-10">
          <button className="text-2xl font-bold">TaskMaster</button>
          <button className="hover:text-blue-400">Dashboard</button>
          <button className="hover:text-blue-400">My Tasks</button>
          <button className="hover:text-blue-400">Calender</button>
          <button className="hover:text-blue-400">Settings</button>
        </div>
        <div>
          <input className="border border-black p-2 rounded" type="text" placeholder="Search Task ..." />
        </div>
      </header>

      <main className="bg-gray-100 min-h-screen pb-20">

        <div className="flex justify-between items-center max-w-7xl mx-auto py-8">
          <div>
            <p className="text-5xl font-medium">To-Do List</p>
            <p className="text-blue-400 mt-2">Track your progress and manage daily priorities</p>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            className="bg-blue-500 h-12 px-6 rounded-xl"
            onClick={handleOpenAdd}
          >
            New Task
          </Button>
        </div>

        <div className="flex justify-between gap-4 max-w-7xl mx-auto pb-8">
          <div className="bg-white flex flex-col justify-center items-center border border-gray-200 rounded-lg h-24 w-full shadow-sm">
            <p className="text-gray-500 text-sm">Total Tasks</p>
            <p className="text-3xl font-bold">{totalTasks}</p>
          </div>
          <div className="bg-white flex flex-col justify-center items-center border border-gray-200 rounded-lg h-24 w-full shadow-sm">
            <p className="text-gray-500 text-sm">In Progress</p>
            <p className="text-3xl font-bold">{inProgressTasks}</p>
          </div>
          <div className="bg-white flex flex-col justify-center items-center border border-gray-200 rounded-lg h-24 w-full shadow-sm">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-3xl font-bold">{completedTasks}</p>
          </div>
        </div>

        <div className="bg-white max-w-7xl mx-auto border border-gray-200 rounded-md shadow-sm p-4">

          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Filter by:</span>
              <Select
                value={filterStatus}
                onChange={(value) => setFilterStatus(value)}
                style={{ width: 160 }}
                suffixIcon={<FilterOutlined className="text-gray-400" />}
                options={[
                  { label: 'Tất cả', value: 'all' },
                  { label: 'Đang làm', value: 'active' },
                  { label: 'Hoàn thành', value: 'completed' },
                  { label: 'Quá hạn', value: 'late' },
                ]}
              />
            </div>

            <Input
              placeholder="Tìm kiếm trong danh sách..."
              prefix={<SearchOutlined />}
              className="w-64"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              allowClear
            />
          </div>

          <Table
            columns={columns}
            dataSource={getFilteredData()}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered={false}
          />

        </div>
      </main>

      <footer className="flex justify-between mx-20 py-10 border-t border-gray-300">
        <div className="flex gap-4 items-center">
          <p className="font-bold">TaskMaster</p>
        </div>
        <div className="flex gap-4 items-center">
          <button className="hover:text-blue-400">Privacy Policy</button>
          <button className="hover:text-blue-400">Terms of Service</button>
          <button className="hover:text-blue-400">Help Center</button>
        </div>
        <div className="flex items-center">
          <p>@ 2023 TaskMaster Inc.</p>
        </div>
      </footer>

      <Modal
        title={editingId ? "Cập nhật công việc" : "Thêm công việc mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText={editingId ? "Lưu" : "Thêm"}
        cancelText="Hủy"
      >
        <div className="flex flex-col gap-4 py-2">
          <div>
            <label className="mb-1 block text-gray-600">Nội dung công việc</label>
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Nhập tên todo..."
              onPressEnter={handleSave}
            />
          </div>
          <div>
            <label className="mb-1 block text-gray-600">Hạn hoàn thành</label>
            <DatePicker
              className="w-full"
              format="YYYY-MM-DD HH:mm"
              showTime={{ format: 'HH:mm' }}
              value={formDeadline}
              onChange={(date) => setFormDeadline(date)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TodoApp;