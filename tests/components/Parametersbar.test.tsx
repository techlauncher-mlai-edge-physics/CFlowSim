/**
 * @jest-environment jsdom
 */


import { render, fireEvent } from '@testing-library/react'
import ParametersBar from "../../src/components/ParametersBar"
import { test, expect, beforeAll, jest } from "@jest/globals"
import '@testing-library/jest-dom/jest-globals'

beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))
    });
  });

test('should change arrow direction on back button', async() => {
    const { getByTestId } = render(<ParametersBar params={null} setParams={null}/>)
    const backbutton = getByTestId('back')

    const left = getByTestId('leftarrow')
    expect(left).toBeInTheDocument()
    fireEvent.click(backbutton)
    const right = getByTestId('rightarrow')
    expect(right).toBeInTheDocument()
})

test('should hide and show pane', async() => {
    const { getByTestId } = render(<ParametersBar params={null} setParams={null}/>)
    const backbutton = getByTestId('back')
    const pane = getByTestId('pane')

    expect(pane).toBeInTheDocument()
    fireEvent.click(backbutton)
    expect(pane).not.toBeInTheDocument()
})


test('back button should retain equal y position between states', async() => {
    const { getByTestId } = render(<ParametersBar params={null} setParams={null}/>)
    const backbutton = getByTestId('back')

    expect(backbutton).toBeInTheDocument()
    const openypos = backbutton.getBoundingClientRect().top
    fireEvent.click(backbutton)
    const closedypos = backbutton.getBoundingClientRect().top
    expect(openypos).toBe(closedypos)
})

// TODO: there aren't any easy/expert mode specific parameters yet. once they are added
// we should make sure to test them here
