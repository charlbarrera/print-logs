"use strict";
const { TempList, TempObj } = require("../lib/temp-log-queu")
// Print all entries, across all of the sources, in chronological order.

// in certain circumstances this will be a linear time complexity and the worst case
// will be O(n^2)
module.exports = (logSources, printer) => {
  const tempList = new TempList(logSources);

  let logsInQueue = true;
  let currentLog = tempList.data.shift();

  while (logsInQueue) {
    printer.print(currentLog);    
    const source = currentLog.logSourceNumber;
    const newLog = logSources[source].pop();
    if (!newLog) {
      if (!tempList.data.length) {
        logsInQueue = false;
        printer.done();
        break;
      }
      // there is no more logs in this source
      tempList.cleanFromList(source);
      currentLog = tempList.data.shift();
    } else {
      const { date, msg } = newLog;
      const tempObj = new TempObj(date, msg, source);
      currentLog = tempList.calculateNextLog(tempObj);
    }
  }

};
