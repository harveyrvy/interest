type Input = {
    start: Date;
    end: Date;
    amount: number;
    currency: string;
    base: number;
    margin: number;
}

type Output = {
    dailyInterestNoMargin: number;
    dailyInterestAccrued: number;
    accrualDate: Date;
    daysElapsed: number;
    totalInterest: number
}

type Calculation = {
    input: Input;
    output: Output;
}

