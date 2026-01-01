import { useState } from "react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header
        className="flex sticky top-0 z-10 bg-white justify-between items-center border-b-1 border-gray-200 px-10 h-18">
        <div className="flex gap-10">
          <button id="button-task-master"
            className="text-2xl font-bold">TaskMaster</button>
          <button id="button-dashboard"
            className="hover:text-blue-400">Dashboard</button>
          <button id="button-my-tasks" className=" hover:text-blue-400">My
            Tasks</button>
          <button id="button-calender"
            className=" hover:text-blue-400">Calender</button>
          <button id="button-settings"
            className=" hover:text-blue-400">Settings</button>
        </div>
        <div>
          <input id="search-task" className="border border-[black] p-2"
            type="text" placeholder="Search Task ..." />
        </div>
      </header>
      <main className="bg-gray-100 h-198">

        <div id="add-task"
          className="flex justify-between max-w-7xl mx-auto py-5 h-40 ">
          <div className="flex flex-col">
            <p className="text-5xl font-medium">To-Do List</p>
            <p className="text-blue-400">Track your progress and manage
              daily priorities</p>
          </div>
          <div className=" flex flex-col items-end">
            <button type="button" id="add-button"
              className=" bg-blue-500 hover:bg-blue-400  text-white rounded-xl cursor-pointer w-30 h-10">+
              New Task</button>
            <div id="add-form"
              className="p-2 mt-2 border hidden rounded-xl">
              <form>
                <input className="border border-[black] rounded-xl p-2 "
                  type="text" id="add-input"
                  placeholder="Add a new todo" />
                <input type="date" id="add-date"
                  className="border border-[black] rounded-xl p-2 " />
                <button type="button" id="add-submit"
                  className="bg-green-300 hover:bg-green-500 cursor-pointer rounded-xl p-2 w-24">Add
                  todo</button>
                <button type="button" id="add-cancel"
                  className="bg-red-300 hover:bg-red-500 cursor-pointer rounded-xl p-2 w-24">Cancel</button>
              </form>
            </div>
          </div>
        </div>
        <div id="status"
          className="flex justify-between gap-4 max-w-7xl mx-auto py-5 border-t border-gray-200">
          <div
            className="bg-white flex flex-col justify-center items-center border border-gray-200 rounded-lg h-24 w-full shadow-sm">
            <p className="text-gray-500 text-sm">Total Tasks</p>
            <p className="text-3xl font-bold" id="stat-total">0</p>
          </div>

          <div
            className="bg-white flex flex-col justify-center items-center border border-gray-200 rounded-lg h-24 w-full shadow-sm">
            <p className="text-gray-500 text-sm">In Progress</p>
            <p className="text-3xl font-bold" id="stat-inprogress">0</p>
          </div>

          <div
            className="bg-white flex flex-col justify-center items-center border border-gray-200 rounded-lg h-24 w-full shadow-sm">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-3xl font-bold" id="stat-completed">0</p>
          </div>
        </div>

        <div
          className="bg-white flex flex-col max-w-7xl m-auto border border-gray-200 rounded-md p min-h-120 ">
          <div
            className="flex justify-start items-center pl-10 border-b-1 border-gray-300">
            <p>Filter by:</p>
            <div className="dropdown relative inline-block text-left m-4">
              <button onclick="toggleDropdown()" id="filter-btn"
                className="dropbtn text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center cursor-pointer">
                <span>Tất cả</span>
                <svg className="fill-current h-4 w-4 ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"><path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </button>
              <div id="myDropdown"
                className="dropdown-content hidden absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <a href="#" onclick="thayDoiBoLoc('all')"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Tất
                    cả</a>
                  <a href="#" onclick="thayDoiBoLoc('active')"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Đang
                    thực hiện</a>
                  <a href="#" onclick="thayDoiBoLoc('completed')"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Đã
                    hoàn thành</a>
                  <a href="#" onclick="thayDoiBoLoc('notlate')"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Chưa
                    tới hạn</a>
                  <a href="#" onclick="thayDoiBoLoc('late')"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Quá
                    hạn</a>
                </div>
              </div>
            </div>
          </div>

          <table className="table-fixed w-full">
            <thead
              className="bg-gray-100 text-gray-600 font-bold uppercase text-sm leading-normal ">
              <tr className="border-b border-gray-300">
                <th className="py-3 px-2 text-center w-[5%]">
                  <div
                    className="flex items-center justify-center">#</div>
                </th>
                <th className="py-3 px-2 text-center w-[10%]">
                  <div
                    className="flex items-center justify-center">Status</div>
                </th>
                <th className="py-3 px-6 text-left w-[35%]">
                  <div
                    className="flex items-center whitespace-nowrap">Task
                    Title</div>
                </th>
                <th className="py-3 px-6 text-left w-[30%]">
                  <div
                    className="flex items-center whitespace-nowrap">Due
                    / Completed</div>
                </th>
                <th className="py-3 px-6 text-center w-[20%]">
                  <div
                    className="flex items-center justify-center">Action</div>
                </th>
              </tr>
            </thead>
            <tbody id="todo-list"></tbody>
          </table>
          <div
            className="flex justify-between items-center mt-auto px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-md">
            <span id="pagination-info"
              className="text-sm text-gray-700">Showing
              <span className="font-semibold text-gray-900">1</span> to
              <span className="font-semibold text-gray-900">5</span> of
            </span>
            <div id="pagination-container"
              className="flex gap-1 items-center">

            </div>
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
    </div>
  );
}