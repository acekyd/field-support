<template>        
    <div class="school_details" v-for="(schoolSummary, index) in sortedSchools">
        <details>
            <summary class="cursor-pointer">
                <span>School {{ schoolSummary[0] }} ({{schoolSummary[1] }} Bad Batteries)</span>
            </summary>
            <table class="table-auto">
                <thead>
                    <tr>
                        <th>Battery</th>
                        <th>24h Consumption (%)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(battery, index) in consumptionData[schoolSummary[0]]" :class="[(needsReplacement(battery)) ? 'bg-red-400 text-white' : '' ]">
                        <td>{{ index }}</td>
                        <td>{{ battery }}</td>
                    </tr>
                </tbody>
            </table>
        </details> 
    </div>

    <div v-show="sortedSchools.length < 1" class="text-center">
        Fetching schools and battery data...
    </div>
</template>

<script setup>
let schoolInformation = {};
const batteryIssues = {};

const getBatteryData = async () => {
    const url = "http://localhost:3000/battery-data.json"; //for flexibility in case url changes
    try {
        const data = await $fetch(url);
        return data;
    } catch (error) {
        console.error('Failed to fetch battery data:', error);
        return [];
    }
};

const processBatteryData = (data) => {
  const schoolInformation = {};

  data.forEach(({ academyId, serialNumber, ...rest }) => {
    if (schoolInformation.hasOwnProperty(academyId)) {
      if (schoolInformation[academyId].hasOwnProperty(serialNumber)) {
        schoolInformation[academyId][serialNumber].push(rest);
      } else {
        schoolInformation[academyId][serialNumber] = [rest];
      }
    } else {
      schoolInformation[academyId] = { [serialNumber]: [rest] };
    }
  });

  return schoolInformation;
};

const calculateBatteryDischarge = (batteryInfo) => {
    if(batteryInfo.length == 1) {
        return "Unknown";
    }

    let lastBatteryLevel = 0;
    let lastTimeMeasured = "";
    let percentageDischarged = 0;
    let dischargeDuration = 0;
    let lastEmployeeId = "";
    let resetWatcher = false;
    let tempChargeTime = "";

    batteryInfo.forEach(item => {
        if(!lastBatteryLevel) {
            lastBatteryLevel = item.batteryLevel;
            lastEmployeeId = item.employeeId
            lastTimeMeasured = item.timestamp;
        } else if(lastBatteryLevel == item.batteryLevel) {
            return;
        } else {
            if(item.batteryLevel > lastBatteryLevel) {
                lastBatteryLevel = item.batteryLevel;
                lastEmployeeId = item.employeeId;
                tempChargeTime = item.timestamp;
                resetWatcher = true;
            } else {
                if(resetWatcher) {
                    percentageDischarged = dischargeDuration = 0;
                    lastTimeMeasured = tempChargeTime;
                    resetWatcher = false;
                }
                percentageDischarged += lastBatteryLevel - item.batteryLevel;
                dischargeDuration += getTimeDifference(item.timestamp, lastTimeMeasured);
                lastBatteryLevel = item.batteryLevel;
                lastEmployeeId = item.employeeId;
                lastTimeMeasured = item.timestamp;
            }
        }
    })

    return getDailyRate(percentageDischarged, dischargeDuration);
}

const getTimeDifference = (time1, time2) => {
    const date1 = new Date(time1);
    const date2 = new Date(time2);
    return date1 - date2;
}

const getDailyRate = (totalRate, totalTime) => {
    let totalHours = totalTime / (1000 * 60 * 60); // 3600000 milliseconds in one hour. 
    let dailyRate = (24/totalHours) * totalRate;
    return Math.round(dailyRate*100);
}

const needsReplacement = (value) => {
    const rate = 30; // for flexibility in case threshold is ever changed.
    if(value > rate) return true;

    return false;
}

const getConsumptionData = (information) => {
    const newData = {};
    Object.keys(information).forEach(key => {
        newData[key] = {};
        batteryIssues[key] = 0;
        Object.keys(information[key]).map(nestedKey => {
            newData[key][nestedKey] = calculateBatteryDischarge(information[key][nestedKey]);
            if(needsReplacement(newData[key][nestedKey])) batteryIssues[key] += 1;
        })
    });

    return newData;
}

const batteryData = await getBatteryData();
schoolInformation = processBatteryData(batteryData);
const consumptionData = getConsumptionData(schoolInformation);
const sortedSchools = computed(() => {
    const sortedArray = Object.entries(batteryIssues).sort((a, b) => b[1] - a[1]);
    return sortedArray;
})

</script>