import * as readline from "readline";
const prompt = require("prompt-sync")();

type Input = {
  start: Date;
  end: Date;
  amount: number;
  currency: string;
  base: number;
  margin: number;
};

type Output = {
  dailyInterestNoMargin: number;
  dailyInterestAccrued: number;
  accrualDate: Date;
  daysElapsed: number;
  totalInterest: number;
};

type Calculation = {
  input: Input;
  output: Output;
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function main() {
  let calculations: Calculation[] = [];
  const option = prompt("create new (n) or use historic (h) transaction?");

  if (option === "n") {
    const input = getInput();
    const output = calculateInterest(input);
    console.log(output);
  } else if (option === "h") {
    console.log("historic");
  } else {
    const input: Input = {
      start: new Date("2025-01-01"),
      end: new Date("2025-07-02"),
      amount: 1000,
      currency: "GBP",
      base: 0.045,
      margin: 0.005,
    };
    const output = calculateInterest(input);
    calculations.push({ input: input, output: output });
    console.log(output);
  }
  return;
}

function getInput(): Input {
  const startDate = new Date(prompt("What is the start date? (yyyy-mm-dd): "));
  const endDate = new Date(prompt("What is the end date? (yyyy-mm-dd): "));
  const amount: number = prompt("What is the loan amount?: ");
  const currency: string = prompt("What is the loan currency?: ");
  const base: number = Number(prompt("What is the base interest rate?: "));
  const margin: number = Number(prompt("What is the margin interest rate?: "));

  const input: Input = {
    start: startDate,
    end: endDate,
    amount: amount,
    currency: currency,
    base: base,
    margin: margin,
  };

  return input;
}

function calculateInterest(input: Input): Output {
  const loanLengthInDays = daysBetween(input.end, input.start);
  const totalRate = input.base + input.margin;
  const dailyInterest = input.amount * totalRate * (1 / 365);
  const totalInterest = dailyInterest * loanLengthInDays;
  const dailyInterestNoMargin = input.amount * input.base * (1 / 365);
  return {
    dailyInterestNoMargin: dailyInterestNoMargin,
    dailyInterestAccrued: dailyInterest,
    accrualDate: new Date(),
    daysElapsed: daysBetween(new Date(), input.start),
    totalInterest: totalInterest,
  };
}

function daysBetween(date1: Date, date2: Date): number {
  const diffInMilli = date1.valueOf() - date2.valueOf();
  const day = 24 * 60 * 60 * 1000;
  const diffInDays = Math.ceil(diffInMilli / day).valueOf();
  return diffInDays;
}

main();
