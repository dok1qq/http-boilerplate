export class BodyParser {
  private constructor() {
    // noop
  }

  static ndjson<T>(response: Response): Promise<Array<T>> {
    return response.text().then((result: string) => {
      const lines = result.match(/.+/g);
      if (lines) {
        return lines.map((line) => JSON.parse(line));
      }
      return [];
    });
  }

  static textEventStream<T>(response: Response): Promise<Array<T>> {
    return response.text().then((result: string) => {
      const lines = result.match(/.+/g);
      if (lines) {
        return lines
          .map((line) => line.replace('data:', ''))
          .map((line) => JSON.parse(line));
      }
      return [];
    });
  }

  static json<T>(response: Response): Promise<T> {
    return response.json();
  }

  static text(response: Response): Promise<string> {
    return response.text();
  }
}
