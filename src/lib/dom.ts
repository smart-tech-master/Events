import {ChangeEvent} from 'react'

export const onChangeStringHandler = (setter: (v: string) => void) => (
  e: ChangeEvent<HTMLInputElement>,
): void => {
  setter(e.currentTarget.value)
}

export const onChangeNumberHandler = (setter: (val: number) => void) => (
  e: ChangeEvent<HTMLInputElement>,
): void => {
  setter(parseInt(e.currentTarget.value))
}

export const onUnknownChangeHandler = <T>(setter: (val: T) => void) => (
  e: ChangeEvent<{value: unknown}>,
) => {
  setter(e.target.value as T)
}

export const onChangeCheckedHandler = (setter: (val: boolean) => void) => (
  e: ChangeEvent<HTMLInputElement>,
): void => {
  setter(e.currentTarget.checked)
}

export const handleChangeSlider = (handler: (newValue: any) => void) => (
  event: any,
  value: number | number[],
) => {
  if (Array.isArray(value)) {
    handler(value[0])
    return
  }

  handler(value)
}
