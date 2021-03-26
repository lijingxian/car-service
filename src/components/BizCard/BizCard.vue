<template>
  <div class="biz-card">
    <div class="biz-card__header" v-if="$slots.header || header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="biz-card__image" v-if="$slots.image || image">
      <slot name="image"><img :src="image" alt="Image" /></slot>
    </div>
    <div class="biz-card__body">
      <slot></slot>
    </div>
    <div class="biz-card__footer" v-if="$slots.footer || footer">
      <slot name="footer">{{ footer }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BizCard',

  props: ['header', 'image', 'footer']
};
</script>

<style lang="scss">
$biz-card-border-color:           #e2e2e2;
$biz-card-border-width:           0;
$biz-card-border-radius:          5px;

$biz-card__image-height:          110px;

$biz-card__header-padding:        10px;
$biz-card__header-bg:             #f6f6f6;

$biz-card__body-padding:          10px;
$biz-card__body-bg:               #fff;

$biz-card__footer-padding:        5px 10px;
$biz-card__footer-bg:             #f6f6f6;

.biz-card {
  border-color: $biz-card-border-color;
  border-style: solid;
  border-width: $biz-card-border-width;
  border-radius: $biz-card-border-radius;

  box-shadow: #d6d6d6 1px 1px 11px;

  > .biz-card__header {
    padding: $biz-card__header-padding;
    background: $biz-card__header-bg;
    border-bottom: $biz-card-border-color solid 1px;
    border-top-left-radius: $biz-card-border-radius;
    border-top-right-radius: $biz-card-border-radius;
  }
  > .biz-card__image {
    padding: 0;
    text-align: center;
    height: $biz-card__image-height;
    overflow: hidden;

    img {
      max-width: 100%;
    }

    &:first-child {
      img {
        border-top-left-radius: $biz-card-border-radius;
        border-top-right-radius: $biz-card-border-radius;
      }
    }
    &:last-child {
      img {
        border-bottom-left-radius: $biz-card-border-radius;
        border-bottom-right-radius: $biz-card-border-radius;
      }
    }
  }
  > .biz-card__body {
    padding: $biz-card__body-padding;
    background: $biz-card__body-bg;

    &:first-child {
      border-top-left-radius: $biz-card-border-radius;
      border-top-right-radius: $biz-card-border-radius;
    }
    &:last-child {
      border-bottom-left-radius: $biz-card-border-radius;
      border-bottom-right-radius: $biz-card-border-radius;
    }
  }
  > .biz-card__footer {
    padding: $biz-card__footer-padding;
    background: $biz-card__footer-bg;
    border-top: $biz-card-border-color solid 1px;
    border-bottom-left-radius: $biz-card-border-radius;
    border-bottom-right-radius: $biz-card-border-radius;
    text-align: center;
  }
}
</style>
