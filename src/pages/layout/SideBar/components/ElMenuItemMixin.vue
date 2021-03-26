<script>
import { MenuItem } from 'element-ui';
import { mapGetters } from 'vuex';
export default {
  name: 'ElMenuItemMixin',
  props: {},
  data() {
    return {};
  },
  mixins: [MenuItem],
  computed: {
    ...mapGetters(['currentUser'])
  },
  watch: {},
  created() {},
  methods: {
    // 记录近期访问的功能
    handleClick(item) {
      console.log(item.target.baseURI.split('#')[1]);
    }
  }
};
</script>
