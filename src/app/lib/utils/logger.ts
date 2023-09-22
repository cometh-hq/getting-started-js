export function logger(message: string, data?: object) {
  console.log("---------------------");
  console.log(message);
  if (data) {
    console.log(data);
  }
  console.log("---------------------");
}
