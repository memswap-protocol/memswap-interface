import { withoutSpace } from '../helpers.mjs';

const conditions = new Set(["_hover","_focus","_focusWithin","_focusVisible","_disabled","_active","_visited","_target","_readOnly","_readWrite","_empty","_checked","_enabled","_expanded","_highlighted","_before","_after","_firstLetter","_firstLine","_marker","_selection","_file","_backdrop","_first","_last","_only","_even","_odd","_firstOfType","_lastOfType","_onlyOfType","_peerFocus","_peerHover","_peerActive","_peerFocusWithin","_peerFocusVisible","_peerDisabled","_peerChecked","_peerInvalid","_peerExpanded","_peerPlaceholderShown","_groupFocus","_groupHover","_groupActive","_groupFocusWithin","_groupFocusVisible","_groupDisabled","_groupChecked","_groupExpanded","_groupInvalid","_indeterminate","_required","_valid","_invalid","_autofill","_inRange","_outOfRange","_placeholder","_placeholderShown","_pressed","_selected","_default","_optional","_open","_fullscreen","_loading","_currentPage","_currentStep","_motionReduce","_motionSafe","_print","_landscape","_portrait","_dark","_light","_osDark","_osLight","_highContrast","_lessContrast","_moreContrast","_ltr","_rtl","_scrollbar","_scrollbarThumb","_scrollbarTrack","_horizontal","_vertical","_typeNumber","_spinButtons","_data_state_open","_data_state_open_child","_data_state_closed","_data_swipe_move","_data_swipe_cancel","_data_swipe_end","bp300","bp300Only","bp300Down","bp400","bp400Only","bp400Down","bp500","bp500Only","bp500Down","sm","smOnly","smDown","bp600","bp600Only","bp600Down","bp700","bp700Only","bp700Down","bp800","bp800Only","bp800Down","md","mdOnly","mdDown","bp900","bp900Only","bp900Down","bp1000","bp1000Only","bp1000Down","bp1100","bp1100Only","bp1100Down","lg","lgOnly","lgDown","bp1200","bp1200Only","bp1200Down","bp1300","bp1300Only","bp1300Down","xl","xlOnly","xlDown","bp1400","bp1400Only","bp1400Down","bp1500","bp1500Only","bp1500Down","2xl","2xlOnly","bp300ToBp400","bp300ToBp500","bp300ToSm","bp300ToBp600","bp300ToBp700","bp300ToBp800","bp300ToMd","bp300ToBp900","bp300ToBp1000","bp300ToBp1100","bp300ToLg","bp300ToBp1200","bp300ToBp1300","bp300ToXl","bp300ToBp1400","bp300ToBp1500","bp300To2xl","bp400ToBp500","bp400ToSm","bp400ToBp600","bp400ToBp700","bp400ToBp800","bp400ToMd","bp400ToBp900","bp400ToBp1000","bp400ToBp1100","bp400ToLg","bp400ToBp1200","bp400ToBp1300","bp400ToXl","bp400ToBp1400","bp400ToBp1500","bp400To2xl","bp500ToSm","bp500ToBp600","bp500ToBp700","bp500ToBp800","bp500ToMd","bp500ToBp900","bp500ToBp1000","bp500ToBp1100","bp500ToLg","bp500ToBp1200","bp500ToBp1300","bp500ToXl","bp500ToBp1400","bp500ToBp1500","bp500To2xl","smToBp600","smToBp700","smToBp800","smToMd","smToBp900","smToBp1000","smToBp1100","smToLg","smToBp1200","smToBp1300","smToXl","smToBp1400","smToBp1500","smTo2xl","bp600ToBp700","bp600ToBp800","bp600ToMd","bp600ToBp900","bp600ToBp1000","bp600ToBp1100","bp600ToLg","bp600ToBp1200","bp600ToBp1300","bp600ToXl","bp600ToBp1400","bp600ToBp1500","bp600To2xl","bp700ToBp800","bp700ToMd","bp700ToBp900","bp700ToBp1000","bp700ToBp1100","bp700ToLg","bp700ToBp1200","bp700ToBp1300","bp700ToXl","bp700ToBp1400","bp700ToBp1500","bp700To2xl","bp800ToMd","bp800ToBp900","bp800ToBp1000","bp800ToBp1100","bp800ToLg","bp800ToBp1200","bp800ToBp1300","bp800ToXl","bp800ToBp1400","bp800ToBp1500","bp800To2xl","mdToBp900","mdToBp1000","mdToBp1100","mdToLg","mdToBp1200","mdToBp1300","mdToXl","mdToBp1400","mdToBp1500","mdTo2xl","bp900ToBp1000","bp900ToBp1100","bp900ToLg","bp900ToBp1200","bp900ToBp1300","bp900ToXl","bp900ToBp1400","bp900ToBp1500","bp900To2xl","bp1000ToBp1100","bp1000ToLg","bp1000ToBp1200","bp1000ToBp1300","bp1000ToXl","bp1000ToBp1400","bp1000ToBp1500","bp1000To2xl","bp1100ToLg","bp1100ToBp1200","bp1100ToBp1300","bp1100ToXl","bp1100ToBp1400","bp1100ToBp1500","bp1100To2xl","lgToBp1200","lgToBp1300","lgToXl","lgToBp1400","lgToBp1500","lgTo2xl","bp1200ToBp1300","bp1200ToXl","bp1200ToBp1400","bp1200ToBp1500","bp1200To2xl","bp1300ToXl","bp1300ToBp1400","bp1300ToBp1500","bp1300To2xl","xlToBp1400","xlToBp1500","xlTo2xl","bp1400ToBp1500","bp1400To2xl","bp1500To2xl","base"])

export function isCondition(value){
  return conditions.has(value) || /^@|&|&$/.test(value)
}

const underscoreRegex = /^_/
const selectorRegex = /&|@/

export function finalizeConditions(paths){
  return paths.map((path) => {
    if (conditions.has(path)){
      return path.replace(underscoreRegex, '')
    }

    if (selectorRegex.test(path)){
      return `[${withoutSpace(path.trim())}]`
    }

    return path
  })}

  export function sortConditions(paths){
    return paths.sort((a, b) => {
      const aa = isCondition(a)
      const bb = isCondition(b)
      if (aa && !bb) return 1
      if (!aa && bb) return -1
      return 0
    })
  }