import { useState, useEffect } from "react";
interface TodoItem {
  id: number;
  title: string;
  deadline: string;
  completed: boolean;
  completedAt: string | null;
}

const TodoApp = () => {

  const [danhSachTodo, setDanhSachTodo] = useState<TodoItem[]>([]);

  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [addButtonCount, setAddButtonCount] = useState(0);
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDeadline, setTodoDeadline] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const LIMIT = 5;


  //
  useEffect(() => {
    const data = localStorage.getItem("danhSachTodo");
    if (data) {
      setDanhSachTodo(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("danhSachTodo", JSON.stringify(danhSachTodo));
  }, [danhSachTodo]);

  //
  const openEditForm = (todo: TodoItem) => {
    setTodoTitle(todo.title);
    setTodoDeadline(todo.deadline);
    setEditingId(todo.id);
    setIsAddFormVisible(true);
  };

  const resetForm = () => {
    setTodoTitle("");
    setTodoDeadline("");
    setEditingId(null);
    setIsAddFormVisible(false);
  };

  //
  const handleDelete = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
      const filtered = danhSachTodo.filter((t) => t.id !== id);
      const reIndexed = filtered.map((item, index) => ({ ...item, id: index + 1 }));
      setDanhSachTodo(reIndexed);

      if (editingId === id) resetForm();
    }
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    const updatedList = danhSachTodo.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: checked,
          completedAt: checked ? new Date().toISOString() : null,
        };
      }
      return todo;
    });
    setDanhSachTodo(updatedList);
  };

  //
  const processedTodos = danhSachTodo.filter((todo) => {
    if (!todo.title.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    const now = new Date();
    let deadlineDate = todo.deadline ? new Date(todo.deadline) : null;
    if (deadlineDate) deadlineDate.setHours(23, 59, 59, 999);

    if (filterStatus === "all") return true;
    if (filterStatus === "active") return !todo.completed;
    if (filterStatus === "completed") return todo.completed;
    if (filterStatus === "notlate") {
      return !todo.completed && (!deadlineDate || deadlineDate >= now);
    }
    if (filterStatus === "late") {
      return !todo.completed && deadlineDate && deadlineDate < now;
    }
    return true;
  });

  //
  const totalPages = Math.ceil(processedTodos.length / LIMIT);
  if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);

  const startIndex = (currentPage - 1) * LIMIT;
  const currentTodos = processedTodos.slice(startIndex, startIndex + LIMIT);

  //
  const totalTasks = danhSachTodo.length;
  const completedTasks = danhSachTodo.filter(t => t.completed).length;
  const inProgressTasks = totalTasks - completedTasks;

  //
  const dueMakeFunction = (deadline: string, completedAt: string | null) => {

    if (completedAt) {
      if (!deadline) {
        return `<span class="text-green-600 font-bold">Đã hoàn thành</span>`;
      }

      const deadlineDate = new Date(deadline);
      deadlineDate.setHours(23, 59, 59, 999);
      const finishedDate = new Date(completedAt);

      const diffTime = finishedDate.getTime() - deadlineDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) return `<span class="text-green-600 font-bold">Đã hoàn thành</span>`;
      else return `<span class="text-orange-500 font-bold">Hoàn thành, muộn ${diffDays} ngày</span>`;
    }

    if (!deadline) return "Không có hạn";

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(23, 59, 59, 999);
    const now = new Date();

    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0) return `<span class="text-blue-600 font-bold">Còn ${diffDays} ngày</span>`;
    else return `<span class="text-red-600 font-bold">Đã muộn ${Math.abs(diffDays)} ngày</span>`;
  };

  //
  const renderPaginationButtons = () => {
    if (totalPages <= 1) return null;
    let pages: (number | string)[] = [];

    if (totalPages <= 5) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 3) pages = [1, 2, 3, 4, "...", totalPages];
      else if (currentPage >= totalPages - 2) pages = [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      else pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    }

    return (
      <div className="flex gap-1 items-center" id="pagination-container">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(c => c - 1)}
          className={`px-3 py-2 border rounded-lg hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50' : ''}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        {pages.map((p, index) => (
          <button
            key={index}
            disabled={p === "..."}
            onClick={() => typeof p === 'number' && setCurrentPage(p)}
            className={`px-3 py-1 rounded-md ${p === currentPage
              ? "border border-blue-500 bg-blue-500 text-white shadow-sm"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              } ${p === "..." ? "cursor-default text-gray-500 border-none hover:bg-transparent" : ""}`}
          >
            {p}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(c => c + 1)}
          className={`px-3 py-2 border rounded-lg hover:bg-gray-100 ${currentPage === totalPages ? 'opacity-50' : ''}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    );
  };

  const getFilterLabel = () => {
    switch (filterStatus) {
      case 'all': return 'Tất cả';
      case 'active': return 'Đang thực hiện';
      case 'completed': return 'Đã hoàn thành';
      case 'notlate': return 'Chưa tới hạn';
      case 'late': return 'Quá hạn';
      default: return 'Tất cả';
    }
  }

  //
  const handleAddTodo = () => {
    setAddButtonCount(addButtonCount + 1);
    console.log("Bạn đã ấn nút add button " + (addButtonCount + 1) + " lan");

    if (!todoTitle || todoTitle.trim() === "") {
      alert("Bạn chưa nhập nội dung vui lòng kiểm tra lại");
      return;
    }

    if (editingId !== null) {
      const danhSachCapNhat = danhSachTodo.map((todo) => {
        if (todo.id === editingId) {
          return { ...todo, title: todoTitle, deadline: todoDeadline };

        }
        return todo;
      });
      setDanhSachTodo(danhSachCapNhat);
      setEditingId(null);
    } else {
      const maxId = danhSachTodo.length > 0 ? Math.max(...danhSachTodo.map((t) => t.id)) : 0;
      const newTodo: TodoItem = {
        id: maxId + 1,
        title: todoTitle,
        deadline: todoDeadline,
        completed: false,
        completedAt: null,
      };

      setDanhSachTodo([...danhSachTodo, newTodo]);
    }

    setTodoTitle("");
    setTodoDeadline("");
    setIsAddFormVisible(false);
    console.log("Bạn đã ấn nút add button");
    setAddButtonCount(addButtonCount + 1);
  };

  return (

    <>
      <header className="flex sticky top-0 z-10 bg-white justify-between items-center border-b-1 border-gray-200 px-10 h-18">
        <div className="flex gap-10">
          <button id="button-task-master" className="text-2xl font-bold">
            TaskMaster
          </button>
          <button id="button-dashboard" className="hover:text-blue-400">
            Dashboard
          </button>
          <button id="button-my-tasks" className=" hover:text-blue-400">
            My Tasks
          </button>
          <button id="button-calender" className=" hover:text-blue-400">
            Calender
          </button>
          <button id="button-settings" className=" hover:text-blue-400">
            Settings
          </button>
        </div>
        <div>
          <input
            id="search-task"
            className="border border-[black] p-2"
            type="text"
            placeholder="Search Task ..."
          />
        </div>
      </header>
      <main className="bg-gray-100 h-198">
        <div
          id="add-task"
          className="flex justify-between max-w-7xl mx-auto py-5 h-40 "
        >
          <div className="flex flex-col">
            <p className="text-5xl font-medium">To-Do List</p>
            <p className="text-blue-400">
              Track your progress and manage daily priorities
            </p>
          </div>
          <div className=" flex flex-col items-end">
            <button
              onClick={() => {
                if (isAddFormVisible) resetForm();
                else setIsAddFormVisible(true);
              }}

              className={`bg-blue-500 hover:bg-blue-400  text-white rounded-xl cursor-pointer w-30 h-10`}
            >
              + New Task
            </button>
            <div
              id="add-form"
              className={`p-2 mt-2 border ${isAddFormVisible ? "block" : "hidden"} rounded-xl`}
            >
              <form>
                <input
                  className="border border-[black] rounded-xl p-2 "
                  type="text"
                  id="add-input"
                  placeholder="Add a new todo"
                  value={todoTitle}
                  onChange={(e) => setTodoTitle(e.target.value)}
                />
                <input
                  type="date"
                  id="add-date"
                  className="border border-[black] rounded-xl p-2 "
                  value={todoDeadline}
                  onChange={(e) => setTodoDeadline(e.target.value)}
                />
                <button
                  type="button"
                  id="add-submit"
                  className={`${editingId ? "bg-orange-300 hover:bg-orange-500" : "bg-green-300 hover:bg-green-500"
                    } cursor-pointer rounded-xl p-2 w-24`}
                  onClick={handleAddTodo}
                >
                  {editingId ? "Cập nhật" : "Add todo"}
                </button>
                <button
                  type="button"
                  className="bg-red-300 hover:bg-red-500 cursor-pointer rounded-xl p-2 w-24"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
        <div
          id="status"
          className="flex justify-between gap-4 max-w-7xl mx-auto py-5 border-t border-gray-200"
        >
          <div className="bg-white flex flex-col justify-center items-center border border-gray-200 rounded-lg h-24 w-full shadow-sm">
            <p className="text-gray-500 text-sm">Total Tasks</p>
            <p className="text-3xl font-bold" >{totalTasks}
            </p>
          </div>

          <div className="bg-white flex flex-col justify-center items-center border border-gray-200 rounded-lg h-24 w-full shadow-sm">
            <p className="text-gray-500 text-sm">In Progress</p>
            <p className="text-3xl font-bold" >{inProgressTasks}
            </p>
          </div>

          <div className="bg-white flex flex-col justify-center items-center border border-gray-200 rounded-lg h-24 w-full shadow-sm">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-3xl font-bold" >{completedTasks}
            </p>
          </div>
        </div>

        <div className="bg-white flex flex-col max-w-7xl m-auto border border-gray-200 rounded-md p min-h-120">
          <div className="flex justify-start items-center pl-10 border-b-1 border-gray-300">
            <p>Filter by:</p>
            <div className="relative inline-block text-left m-4">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center cursor-pointer hover:bg-gray-100"
              >
                <span>{getFilterLabel()}</span>
                <svg className="fill-current h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    {['all', 'active', 'completed', 'notlate', 'late'].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setFilterStatus(type);
                          setCurrentPage(1);
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {type === 'all' ? 'Tất cả' :
                          type === 'active' ? 'Đang thực hiện' :
                            type === 'completed' ? 'Đã hoàn thành' :
                              type === 'notlate' ? 'Chưa tới hạn' : 'Quá hạn'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <table className="table-fixed w-full">
            <thead className="bg-gray-100 text-gray-600 font-bold uppercase text-sm leading-normal ">
              <tr className="border-b border-gray-300">
                <th className="py-3 px-2 text-center w-[5%]">
                  <div className="flex items-center justify-center">#</div>
                </th>
                <th className="py-3 px-2 text-center w-[10%]">
                  <div className="flex items-center justify-center">Status</div>
                </th>
                <th className="py-3 px-6 text-left w-[35%]">
                  <div className="flex items-center whitespace-nowrap">
                    Task Title
                  </div>
                </th>
                <th className="py-3 px-6 text-left w-[30%]">
                  <div className="flex items-center whitespace-nowrap">
                    Due / Completed
                  </div>
                </th>
                <th className="py-3 px-6 text-center w-[20%]">
                  <div className="flex items-center justify-center">Action</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTodos.map((todo) => {
                const statusText = dueMakeFunction(todo.deadline, todo.completedAt);
                return (
                  <tr key={todo.id} className="table-fixed w-full even:bg-gray-100 hover:bg-gray-300 border-b border-gray-300">
                    <td><div className="py-3 px-2 text-center">{todo.id}</div></td>
                    <td>
                      <div className="py-3 px-2 text-center">
                        <input
                          className="w-[25px] h-[25px] cursor-pointer accent-green-600"
                          type="checkbox"
                          checked={todo.completed}
                          onChange={(e) => handleCheckboxChange(todo.id, e.target.checked)}
                        />
                      </div>
                    </td>
                    <td><div className="block truncate py-3 px-6 text-left">{todo.title}</div></td>
                    <td>
                      <div
                        className="py-3 px-6 text-left"
                        dangerouslySetInnerHTML={{ __html: statusText }}
                      ></div>
                    </td>
                    <td>
                      <div className="flex gap-4 py-3 px-6 text-center justify-center">
                        <button
                          onClick={() => openEditForm(todo)}
                          className="cursor-pointer rounded-md border border-black p-1 px-4 bg-white hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(todo.id)}
                          className="cursor-pointer rounded-md border border-black p-1 px-2 bg-red-500 hover:bg-red-400 text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {Array.from({ length: Math.max(0, LIMIT - currentTodos.length) }).map((_, idx) => (
                <tr key={`empty-${idx}`} className="h-[58px] border-b border-gray-300 even:bg-gray-100">
                  <td colSpan={5}>&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center h-18 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-md">
            <span className="text-sm text-gray-700">
              Showing
              <span className="font-semibold text-gray-900">{" " + (processedTodos.length > 0 ? startIndex + 1 : 0)}</span> to
              <span className="font-semibold text-gray-900">{" " + Math.min(startIndex + LIMIT, processedTodos.length)}</span> of
              <span className="font-semibold text-gray-900">{" " + processedTodos.length}</span> Tasks
            </span>
            {renderPaginationButtons()}
          </div>
        </div>
      </main>
      <footer className="flex justify-between mx-20">
        <div className="flex gap-4  items-center">
          <p>TaskMaster</p>
        </div>
        <div className="flex gap-4  items-center  ">
          <button className=" hover:text-blue-400">Privacy Policy</button>
          <button className=" hover:text-blue-400">Terms of Service</button>
          <button className=" hover:text-blue-400">Help Center</button>
        </div>
        <div className="flex items-center rounded-lg h-20 w-50">
          <p>@ 2023 TaskMaster Inc.</p>
        </div>
      </footer>
    </>
  );

};
export default TodoApp;
