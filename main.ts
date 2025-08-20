import promptSync from "prompt-sync";
const prompt = promptSync({ sigint: true });

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

function main() {
  let calculations: Calculation[] = [];
  let run = true;
  while (run) {
    let option = prompt(
      "create new (n), use historic (h) transaction, use default (d), or quit (q)? "
    );
    if (option === "n") {
      const [input, output] = newCalculation();
      calculations.push({ input: input, output: output });
      console.log(output);
    } else if (option === "h") {
      const [newInput, output] = historicCalculation(calculations);
      console.log(output);
      calculations.push({ input: newInput, output: output });
    } else if (option === "q") {
      run = false;
    } else if (option === "d") {
      const [input, output] = defaultCalculation();
      console.log(output);
      calculations.push({ input: input, output: output });
    }
  }
}

function newCalculation(): [Input, Output] {
  const input = getNewInput();
  const output = calculateInterest(input);
  return [input, output];
}

function historicCalculation(calculations: Calculation[]): [Input, Output] {
  for (let i = 0; i < calculations.length; i++) {
    printHistoric(calculations[i], i + 1);
  }
  let n: number = Number(prompt("pick a numbered option: "));
  while (isNaN(n)) {
    console.log(
      "Invalid selection, please enter a number between 1 and " +
        calculations.length
    );
    n = Number(prompt("pick a numbered option: "));
  }
  const newInput = getHistoricInput(calculations[n - 1].input);
  const output = calculateInterest(newInput);
  return [newInput, output];
}

function defaultCalculation(): [Input, Output] {
  const input: Input = {
    start: new Date("01/01/2025"),
    end: new Date("07/02/2025"),
    amount: 1000,
    currency: "GBP",
    base: 0.045,
    margin: 0.005,
  };
  const output = calculateInterest(input);
  return [input, output];
}

function getNewInput(): Input {
  const startDate = new Date(prompt("What is the start date? (mm/dd/yyyy): "));
  const endDate = new Date(prompt("What is the end date? (mm/dd/yyyy): "));
  const amount: number = Number(prompt("What is the loan amount?: "));
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

function getHistoricInput(input: Input): Input {
  console.log("Type updated input or press Enter to keep it the same:");
  const startDate = new Date(
    prompt(
      "What is the start date? (mm/dd/yyyy): " +
        "(" +
        input.start.toLocaleDateString() +
        "): "
    )
  );
  const endDate = new Date(
    prompt(
      "What is the end date? (mm/dd/yyyy): " +
        "(" +
        input.end.toLocaleDateString() +
        "): "
    )
  );
  const amount = prompt(
    "What is the loan amount? " + "(" + input.amount + "): "
  );
  const currency = prompt(
    "What is the loan currency? " + "(" + input.currency + "): "
  );
  const base = prompt(
    "What is the base interest rate? " + "(" + input.base + "): "
  );
  const margin = prompt(
    "What is the margin interest rate? " + "(" + input.margin + "): "
  );
  // when user presses enter, blank return from prompt is ""
  const newInput: Input = {
    start: !isNaN(startDate.getTime()) ? startDate : input.start,
    end: !isNaN(endDate.getTime()) ? endDate : input.end,
    amount: amount ? Number(amount) : input.amount,
    currency: currency || input.currency,
    base: base ? Number(base) : input.base,
    margin: margin ? Number(margin) : input.margin,
  };

  return newInput;
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

function printHistoric(calculation: Calculation, n: number) {
  console.log(
    "[" +
      n +
      "]" +
      " input: loan amount: " +
      calculation.input.amount +
      calculation.input.currency +
      " at " +
      (calculation.input.base + calculation.input.margin) * 100 +
      "% total rate from " +
      calculation.input.start.toLocaleDateString() +
      " to " +
      calculation.input.end.toLocaleDateString() +
      "\n output: resulting in  " +
      calculation.output.totalInterest.toFixed(2) +
      calculation.input.currency +
      " total interest."
  );
}

main();
