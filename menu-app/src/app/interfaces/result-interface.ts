export interface AnnotatedImage {
  data: Results [];
}

export interface Results {
  bound: number[][];
  text: string[];
}
