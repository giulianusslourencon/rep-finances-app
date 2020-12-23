export interface UseCase<Props = undefined, Response = Promise<void>> {
  execute(props: Props): Response
}
