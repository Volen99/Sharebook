import {Component, Input, OnInit} from '@angular/core';
import {IconDefinition} from "@fortawesome/fontawesome-common-types";
import {ISocialContextProps} from "../post.component";

@Component({
  selector: 'app-social-context',
  templateUrl: './social-context.component.html',
  styleUrls: ['./social-context.component.scss']
})
export class SocialContextComponent implements OnInit {
  @Input() socialContextProps: ISocialContextProps;


  constructor() { }

  ngOnInit(): void {
  }

  svgStyles = {
    'color': 'rgb(110, 118, 125)',
    'display': 'inline-block',
    'fill': 'currentcolor',
    'height': '16px',
    'width': '16px',
    'max-width': '100%',
    'position': 'relative',
    'vertical-align': 'text-bottom',
    '-moz-user-select': 'none',
    '-ms-user-select': 'none',
    '-webkit-user-select': 'none',
    'user-select': 'none',
  };

}