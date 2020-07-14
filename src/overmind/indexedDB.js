const config = {
  dataBaseName: 'timesheet',
  version: 3,
};

const indexedDB = objectName => ({
  init: async () => {
    if (window.indexedDB) {
      return new Promise(resolve => {
        const request = window.indexedDB.open(
          config.dataBaseName,
          config.version
        );
        request.onupgradeneeded = event => resolve(event.target.result);
      });
    }
    throw new Error('IndexedDB not supported');
  },
  add: data => {
    return new Promise(resolve => {
      if (window.indexedDB) {
        const request = window.indexedDB.open(
          config.dataBaseName,
          config.version
        );
        request.onsuccess = event => {
          const db = event.target.result;
          const objectStore = db
            .transaction(objectName, 'readwrite')
            .objectStore(objectName);
          const req = objectStore.add(data);
          req.onsuccess = e => resolve(req.result);
        };
      }
    });
  },
  update: datas => {
    if (window.indexedDB) {
      const request = window.indexedDB.open(
        config.dataBaseName,
        config.version
      );
      request.onsuccess = event => {
        const db = event.target.result;
        const objectStore = db
          .transaction(objectName, 'readwrite')
          .objectStore(objectName);
        datas.forEach(data => objectStore.put(data));
      };
    }
  },
  remove: key => {
    return new Promise(resolve => {
      if (window.indexedDB) {
        const request = window.indexedDB.open(
          config.dataBaseName,
          config.version
        );
        request.onsuccess = event => {
          const db = event.target.result;
          const objectStore = db
            .transaction(objectName, 'readwrite')
            .objectStore(objectName);
          const req = objectStore.delete(key);
          req.onsuccess = e => resolve(req.result);
        };
      }
    });
  },
  getByIndex: (indexName, values) => {
    if (window.indexedDB) {
      return new Promise(resolve => {
        const request = window.indexedDB.open(
          config.dataBaseName,
          config.version
        );
        request.onsuccess = event => {
          const db = event.target.result;
          const objectStore = db
            .transaction(objectName, 'readwrite')
            .objectStore(objectName);

          const result = [];
          let index = 0;
          const { length } = values;
          values.forEach(value => {
            objectStore
              .index(indexName)
              .openKeyCursor(IDBKeyRange.only(value)).onsuccess = e => {
              const cursor = e.target.result;
              if (cursor) {
                objectStore.get(cursor.primaryKey).onsuccess = ev =>
                  result.push(ev.target.result);
                cursor.continue();
              } else {
                index += 1;
                if (index === length) resolve(result);
              }
            };
          });
        };
      });
    }

    throw new Error('IndexedDB not supported');
  },
  getAll: () => {
    if (window.indexedDB) {
      return new Promise(resolve => {
        const request = window.indexedDB.open(
          config.dataBaseName,
          config.version
        );
        request.onsuccess = event => {
          const db = event.target.result;
          const objectStore = db
            .transaction(objectName, 'readwrite')
            .objectStore(objectName);

          objectStore.getAll().onsuccess = e => {
            resolve(e.target.result);
          };
        };
      });
    }

    throw new Error('IndexedDB not supported');
  },
});

export default indexedDB;
