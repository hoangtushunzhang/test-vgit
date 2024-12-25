const jsonfile = require("jsonfile");
const moment = require("moment");
const simpleGit = require("simple-git");

// Đường dẫn tới file JSON
const path = "./data.json";

// Kiểm tra ngày hợp lệ
const isValidDate = (date) => {
    const startDate = moment("2019-01-01");
    const endDate = moment("2024-12-31"); // Bạn có thể thay đổi ngày kết thúc
    return date.isBetween(startDate, endDate, null, "[]");
};

// Đánh dấu commit
const markCommit = async (date) => {
    const data = { date: date.toISOString() };
    await jsonfile.writeFile(path, data);

    const git = simpleGit();
    await git.add([path]);
    await git.commit(date.toISOString(), { "--date": date.toISOString() });
};

// Tạo commit ngẫu nhiên
const makeCommits = async (n) => {
    const git = simpleGit();

    for (let i = 0; i < n; i++) {
        // Tạo tuần và ngày ngẫu nhiên
        const randomWeeks = Math.floor(Math.random() * (54 * 4));
        const randomDays = Math.floor(Math.random() * 7);

        // Tính toán ngày ngẫu nhiên
        const randomDate = moment("2019-01-01")
            .add(randomWeeks, "weeks")
            .add(randomDays, "days");

        if (isValidDate(randomDate)) {
            console.log(`Creating commit: ${randomDate.toISOString()}`);
            await markCommit(randomDate);
        } else {
            console.log(`Invalid date: ${randomDate.toISOString()}, skipping...`);
        }
    }

    console.log("Pushing all commits...");
    await git.push();
};

// Gọi hàm tạo 50,000 commit
makeCommits(50000);
