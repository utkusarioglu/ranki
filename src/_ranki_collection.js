export class Collection
{
  static getFields(side, _ranki) 
  {
    switch (side) {
      case "front":
        return [
          "Question-Start-Pre",
          "Front-Prompt-Pre",
          "Question-End-Pre",
        ];

      case "back":
        return [
          "Answer-Start-Pre",
          "Back-Prompt-Pre",
          "Answer-End-Pre",
        ];

      default:
        return [];
    }
  }
}
