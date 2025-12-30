import { useState, useEffect } from "react";

const TodoApp = () => {
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [addButtonCount, setAddButtonCount] = useState(0);
  const [danhSachTodo, setDanhSachTodo] = useState([]);

  const [todoTitle, setTodoTitle] = useState("");
  const [todoDeadline, setTodoDeadline] = useState("");

  const toggleDropdown = () => {
    // if(document){
    //     const dropdown = document.getElementById("myDropdown");
    //     if (dropdown) {
    //         dropdown.classList.toggle("hidden");
    //     }
    // }
  };

  const handleChangeTodoTitle = (e) => {
    setTodoTitle(e.target.value);
  };
  const handleChangeTodoDeadline = (e) => {
    setTodoDeadline(e.target.value);
  };

  const capNhatDanhSachTodo = () => {
    console.log(danhSachTodo);
    localStorage.setItem("danhSachTodo", JSON.stringify(danhSachTodo));
  };

  const handleAddTodo = () => {
    console.log({
      todoTitle,
      todoDeadline,
    });

    const danhSachTodo_moi = [
      ...danhSachTodo,
      {
        title: todoTitle,
        deadline: todoDeadline,
        completed: false,
      },
    ];

    setDanhSachTodo(danhSachTodo_moi);
    capNhatDanhSachTodo();
  };

  const handleClickAddButton = (e) => {
    console.log("Bạn đã ấn nút add button");
    setAddButtonCount(addButtonCount + 1);
    if (isAddFormVisible === true) {
      setIsAddFormVisible(false);
    } else {
      setIsAddFormVisible(true);
    }
  };

  const syncDanhSachTodo = () => {
    const danhSachTodo_duocLuuTrongBoNho = localStorage.getItem("danhSachTodo");
    if (danhSachTodo_duocLuuTrongBoNho) {
      const danhSachTodo = JSON.parse(danhSachTodo_duocLuuTrongBoNho);
      console.log("Danh sách todo được lưu trong bộ nhớ: ", danhSachTodo);
      setDanhSachTodo(danhSachTodo);
    }
  };

  useEffect(() => {
    syncDanhSachTodo();
  }, []);

  const dueMakeFunction = (deadline, completedAt) => {
    if (!deadline) return "Không có hạn";

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(23, 59, 59, 999);

    const now = new Date();

    if (completedAt) {
      const finishedDate = new Date(completedAt);
      const diffTime = finishedDate - deadlineDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        return `<span class="text-green-600 font-bold">Đã hoàn thành</span>`;
      } else {
        return `<span class="text-orange-500 font-bold">Hoàn thành, muộn ${diffDays} ngày</span>`;
      }
    } else {
      const diffTime = deadlineDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0) {
        return `<span class="text-blue-600 font-bold">Còn ${diffDays} ngày</span>`;
      } else {
        return `<span class="text-red-600 font-bold">Đã muộn ${Math.abs(
          diffDays
        )} ngày</span>`;
      }
    }
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
              onClick={handleClickAddButton}
              type="button"
              id="add-button"
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
                  onChange={handleChangeTodoTitle}
                />
                <input
                  type="date"
                  id="add-date"
                  className="border border-[black] rounded-xl p-2 "
                  value={todoDeadline}
                  onChange={handleChangeTodoDeadline}
                />
                <button
                  type="button"
                  id="add-submit"
                  className="bg-green-300 hover:bg-green-500 cursor-pointer rounded-xl p-2 w-24"
                  onClick={handleAddTodo}
                >
                  Add todo
                </button>
                <button
                  type="button"
                  id="add-cancel"
                  className="bg-red-300 hover:bg-red-500 cursor-pointer rounded-xl p-2 w-24"
                  onClick={() => {
                    setIsAddFormVisible(false);
                    setTodoTitle("");
                    setTodoDeadline("");
                  }}
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
            <p className="text-3xl font-bold" id="stat-total">
              0
            </p>
          </div>

          <div className="bg-white flex flex-col justify-center items-center border border-gray-200 rounded-lg h-24 w-full shadow-sm">
            <p className="text-gray-500 text-sm">In Progress</p>
            <p className="text-3xl font-bold" id="stat-inprogress">
              0
            </p>
          </div>

          <div className="bg-white flex flex-col justify-center items-center border border-gray-200 rounded-lg h-24 w-full shadow-sm">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-3xl font-bold" id="stat-completed">
              0
            </p>
          </div>
        </div>

        <div className="bg-white flex flex-col max-w-7xl m-auto border border-gray-200 rounded-md p min-h-120 ">
          <div className="flex justify-start items-center pl-10 border-b-1 border-gray-300">
            <p>Filter by:</p>
            <div className="dropdown relative inline-block text-left m-4">
              <button
                onClick={toggleDropdown()}
                id="filter-btn"
                className="dropbtn text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center cursor-pointer"
              >
                <span>Tất cả</span>
                <svg
                  className="fill-current h-4 w-4 ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </button>
              <div
                id="myDropdown"
                className="dropdown-content hidden absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10"
              >
                <div className="py-1">
                  <a
                    href="#"
                    onClick="thayDoiBoLoc('all')"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Tất cả
                  </a>
                  <a
                    href="#"
                    onClick="thayDoiBoLoc('active')"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Đang thực hiện
                  </a>
                  <a
                    href="#"
                    onClick="thayDoiBoLoc('completed')"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Đã hoàn thành
                  </a>
                  <a
                    href="#"
                    onClick="thayDoiBoLoc('notlate')"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Chưa tới hạn
                  </a>
                  <a
                    href="#"
                    onClick="thayDoiBoLoc('late')"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Quá hạn
                  </a>
                </div>
              </div>
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
            <tbody id="todo-list">
              {danhSachTodo.map(
                (
                  todo: {
                    title: string;
                    deadline: string;
                    completed: boolean;
                  },
                  index
                ) => {
                  const statusText = dueMakeFunction(
                    todo.deadline,
                    todo.deadline
                  );
                  return (
                    <tr className="table-fixed w-full even:bg-gray-100 hover:bg-gray-300 border-b border-gray-300">
                      <td>
                        <div className="py-3 px-2 text-center">{index + 1}</div>
                      </td>
                      <td>
                        <div className="py-3 px-2 text-center">
                          <input
                            className="checkbox-todo w-[25px] h-[25px] cursor-pointer accent-green-600"
                            data-index="${
                                  order - 1
                                }"
                            type="checkbox"
                            checked={todo.completed}
                          />
                        </div>
                      </td>
                      <td>
                        <div className=" block truncate py-3 px-6 text-left w-[30%]">
                          {todo.title}
                        </div>
                      </td>
                      <td>
                        <div
                          className="py-3 px-6 text-left w-[80%]"
                          dangerouslySetInnerHTML={{ __html: statusText }}
                        ></div>
                      </td>
                      <td>
                        <div className="flex gap-4 py-3 px-6 text-center w-[20%]">
                          <button
                            className="edit-button cursor-pointer rounded-md border border-[black] p-1 px-4 flex items-center bg-[white] hover:bg-gray-100"
                            data-index="${
                                  order - 1
                                }"
                          >
                            Edit
                          </button>
                          <button
                            className="delete-button cursor-pointer rounded-md border border-[black] p-1 px-2 flex items-center bg-[red] hover:bg-red-400 text-white"
                            data-index="${
                                  order - 1
                                }"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-auto px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-md">
            <span id="pagination-info" className="text-sm text-gray-700">
              Showing
              <span className="font-semibold text-gray-900">1</span> to
              <span className="font-semibold text-gray-900">5</span> of
            </span>
            <div
              id="pagination-container"
              className="flex gap-1 items-center"
            ></div>
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
