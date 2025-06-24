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

module.exports = {
  getTasksByListId,
  createTask,
}
  