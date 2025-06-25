const taskRepo = require('../repositories/task.repository');
const listRepo = require('../repositories/list.repository');

function getTasksByListId(listId, limit = 100, offset = 0) {
    const list = listRepo.findById(listId);

    if(!list) {
      throw new Error('LIST_NOT_FOUND');
    }

    return taskRepo.findTasksByListId(listId, limit, offset);
};

function createTask(listId, title) {
  const list = listRepo.findById(listId);

  if (!list) {
    throw new Error('LIST_NOT_FOUND');
  }

  const lastTask = taskRepo.findLastTaskInList(listId);
  const newPosition = lastTask ? lastTask.position + 1000 : 1000;

  return taskRepo.createTask(listId, title, newPosition);
}

function updateTask(taskId, updates) {
  const task = taskRepo.findById(taskId);
  if (!task) throw new Error('TASK_NOT_FOUND');

  let newTitle = updates.title !== undefined ? updates.title.trim() : task.title;
  let newPosition = task.position;

  if (updates.beforeTaskId || updates.afterTaskId) {
    const before = updates.beforeTaskId ? taskRepo.findById(parseInt(updates.beforeTaskId)) : null;
    const after = updates.afterTaskId ? taskRepo.findById(parseInt(updates.afterTaskId)) : null;

    if(before && after) {
      newPosition = (before.position + after.position) / 2;
    } else if (before) {
      const next = taskRepo.findNextTask(task.list_id, before.position);

      newPosition = next
        ? (before.position + next.position) / 2
        : before.position + 1000;
    } else if (after) {
      const previous = taskRepo.findPreviousTask(task.list_id, after.position);

      newPosition = previous
        ? (previous.position + after.position) / 2
        : after.position - 1000;
    } else {
      // Do nothing, keep old position
    }
  }

  taskRepo.updateTask(taskId, newTitle, newPosition);

  return taskRepo.findById(taskId);
}

function deleteTask(taskId) {
  const task = taskRepo.findById(taskId);

  if (!task) throw new Error('TASK_NOT_FOUND');

  taskRepo.deleteTask(taskId);
}

module.exports = {
  getTasksByListId,
  createTask,
  updateTask,
  deleteTask,
}
