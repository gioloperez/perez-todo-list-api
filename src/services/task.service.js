const TaskRepo = require('../repositories/task.repository');
const ListRepo = require('../repositories/list.repository');

function getTasksByListId(listId, limit = 100, offset = 0) {
    const list = ListRepo.findById(listId);

    if(!list) {
      throw new Error('LIST_NOT_FOUND');
    }

    return TaskRepo.findTasksByListId(listId, limit, offset);
};

function createTask(listId, title) {
  const list = ListRepo.findById(listId);

  if (!list) {
    throw new Error('LIST_NOT_FOUND');
  }

  const lastTask = TaskRepo.findLastTaskInList(listId);
  const newPosition = lastTask ? lastTask.position + 1000 : 1000;

  return TaskRepo.createTask(listId, title, newPosition);
}

function updateTask(taskId, updates) {
  const task = TaskRepo.findById(taskId);
  if (!task) throw new Error('TASK_NOT_FOUND');

  let newTitle = updates.title !== undefined ? updates.title.trim() : task.title;
  let newPosition = task.position;

  if (updates.beforeTaskId || updates.afterTaskId) {
    const before = updates.beforeTaskId ? TaskRepo.findById(parseInt(updates.beforeTaskId)) : null;
    const after = updates.afterTaskId ? TaskRepo.findById(parseInt(updates.afterTaskId)) : null;

    if(before && after) {
      newPosition = (before.position + after.position) / 2;
    } else if (before) {
      newPosition = before.position + 1000;
    } else if (after) {
      newPosition = after.position - 1000;
    } else {
      // Do nothing, keep old position
    }
  }

  TaskRepo.updateTask(taskId, newTitle, newPosition);

  return {
    ...task,
    title: newTitle,
    position: newPosition,
  };
}

module.exports = {
  getTasksByListId,
  createTask,
  updateTask,
}
