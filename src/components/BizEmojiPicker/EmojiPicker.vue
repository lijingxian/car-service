<template>
  <div class="emoji-picker">
    <div class="body">
      <div class="emoji"
           v-for="(emoji,_index) of currentEmojis"
           :key="_index"
           @click="choose(emoji.key)">
        <img :src="emoji.value">
      </div>
    </div>
    <div class="footer">
      <el-button size="mini"
                 type="primary"
                 :disabled="index===0"
                 @click="pageUp"
                 icon="el-icon-arrow-left"></el-button>
      <el-button size="mini"
                 type="primary"
                 :disabled="index+72>109"
                 @click="pageDown"
                 icon="el-icon-arrow-right"></el-button>
    </div>
  </div>
</template>

<script>
import emoji from '@/utils/emoji';

export default {
  name: 'EmojiPicker',
  data() {
    return {
      index: 0,
      emojis: emoji.emojis
    };
  },
  computed: {
    currentEmojis() {
      return this.emojis.slice(this.index, this.index + 72);
    }
  },
  methods: {
    pageDown() {
      this.index += 72;
    },
    pageUp() {
      this.index -= 72;
    },
    choose(key) {
      this.$emit('choosed', key);
    }
  }
};
</script>

<style lang="scss">
.emoji-picker {
  width: 390px;
  height: 240px;
  .body {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    align-content: flex-start;
    width: 390px;
    height: 200px;
    .emoji {
      width: 32px;
      height: 32px;
      border: 1px solid rgba(249, 135, 0, 0);
      opacity: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      transition: all 0.2s;
      img {
        width: 25px;
      }
      &:hover {
        border-color: rgba(249, 135, 0, 0.9);
      }
    }
    .high-definition {
      width: 64px;
      height: 64px;
      border: 1px solid rgba(249, 135, 0, 0);
      opacity: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      transition: all 0.2s;
      img {
        width: 40px;
      }
      &:hover {
        border-color: rgba(249, 135, 0, 0.9);
      }
    }
    .gif {
      width: 64px;
      height: 64px;
      border: 1px solid rgba(249, 135, 0, 0);
      opacity: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      transition: all 0.2s;
      img {
        width: 62px;
      }
      &:hover {
        border-color: rgba(249, 135, 0, 0.9);
      }
    }
  }
  .footer {
    margin: 5px 0;
    display: flex;
    justify-content: space-between;
    .el-button {
      padding: 3px 10px;
      margin: 0 15px;
    }
  }
}
</style>
