import { Pipe } from '@angular/core';
import { CapitalizePipe } from './capitalize.pipe';
import { TestBed } from '@angular/core/testing';

describe('CapitalizePipe', () => {
  let pipe:CapitalizePipe;

  beforeEach(()=>{
    pipe = new CapitalizePipe();
  })

  it('create an instance', () => {
    const pipe = new CapitalizePipe();
    expect(pipe).toBeTruthy();
  });

  it('should capitalize string',() => {
    expect(pipe.transform('shubham')).toBe('Shubham')
  })

  it('should it return empty string',() => {
    expect(pipe.transform('')).toBe('')
  })
});
