const TaskRepo = require('../repositories/task.repository');
const ListRepo = require('../repositories/list.repository');

exports.getTasksByListId = (listId, limit = 100, offset = 0) => {
    const list = ListRepo.findById(listId);

    console.log(list);

    if(!list) {
      throw new Error('LIST_NOT_FOUND');
    }

    return TaskRepo.findTasksByListId(listId, limit, offset);
};
  