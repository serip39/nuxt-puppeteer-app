<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        nuxt-puppeteer-app
      </h1>
      <div class="main">
        <h2>鉄道運行状況</h2>
        <p class="time">更新日時：{{ data.datetime }}</p>
        <table border="1">
          <thead>
            <tr>
              <th>路線名</th>
              <th>運行状況</th>
              <th>備考</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="train in data.trains"
              :key="train.yahooId"
            >
              <td>{{ train.name }}</td>
              <td>{{ train.status }}</td>
              <td>{{ train.desc }}</td>
            </tr>
          </tbody>
        </table>
        <button　@click="reload">更新</button>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  async asyncData({ $axios }) {
    const data = await $axios.$get('/api/scraping')
    return { data }
  },
  components: {
    Logo
  },

  data: () => ({
    data: []
  }),

  methods: {
    reload() {
      location.reload()
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 50px;
  color: #35495e;
  letter-spacing: 1px;
}

h2 {
  padding: 10px 0;
}
.time {
  text-align: right;
}
table {
  border-collapse: collapse;
}
td {
  padding: 10px;
}
button {
  margin-top: 20px;
  width: 100%;
}

</style>
