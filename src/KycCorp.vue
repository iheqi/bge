<script setup>
import SiteHeader from './SiteHeader.vue'
import UserSidebar from './UserSidebar.vue'

const documents = [
  'corpDoc1',
  'corpDoc2',
  'corpDoc3',
  'corpDoc4',
  'corpDoc5',
  'corpDoc6',
  'corpDoc7',
  'corpDoc8',
  'corpDoc9',
  'corpDoc10',
  'corpDoc11',
]
const investorDocuments = ['corpDoc12', 'corpDoc13']
const files = ['corpFile1', 'corpFile2', 'corpFile3', 'corpFile4']
</script>

<template>
  <div class="user-page">
    <SiteHeader active="kyc" />
    <div class="user-layout">
      <UserSidebar />
      <main class="person-main">
        <section class="person-box">
          <h1 class="person-title">{{ $t('kycCorpTitle') }}</h1>

          <div class="corp-hero">
            <div class="corp-hero-text">
              <b>{{ $t('corpPrepare') }}</b>
              <span>{{ $t('corpPrepareDesc') }}</span>
            </div>
            <svg
              class="corp-hero-art"
              viewBox="0 0 460 240"
              aria-hidden="true"
            >
              <circle
                cx="408"
                cy="34"
                r="22"
                fill="none"
                stroke="#eadfca"
                stroke-width="4"
              />
              <path
                d="M408 22v14l10 6"
                stroke="#d9a600"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"
              />
              <path
                d="M232 78a80 80 0 0 1 78-30"
                fill="none"
                stroke="#e4d6ba"
                stroke-width="3"
                stroke-dasharray="2 10"
                stroke-linecap="round"
              />
              <rect
                x="96"
                y="132"
                width="150"
                height="72"
                rx="8"
                fill="#e8b93f"
              />
              <path
                d="M96 140l75 44 75-44"
                fill="none"
                stroke="#d9a600"
                stroke-width="3"
              />
              <path
                d="M72 122l30-66 30 26 26-18 30 58z"
                fill="#fdf6e6"
                stroke="#efe3cd"
                stroke-width="2"
              />
              <circle
                cx="286"
                cy="90"
                r="16"
                fill="#2c3a52"
              />
              <path
                d="M264 176c0-30 10-46 22-46s22 16 22 46z"
                fill="#2c3a52"
              />
              <path
                d="M300 116l34-24"
                stroke="#2c3a52"
                stroke-width="11"
                stroke-linecap="round"
              />
              <rect
                x="330"
                y="76"
                width="42"
                height="28"
                rx="4"
                transform="rotate(-18 330 76)"
                fill="#f0c518"
              />
              <path
                d="M338 92l10 6 14-16"
                stroke="#fff"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"
                transform="rotate(-18 330 76)"
              />
            </svg>
          </div>

          <div class="person-chip-row"><span class="person-chip">{{ $t('corpChipMail') }}</span></div>
          <p class="corp-lead">{{ $t('corpLead1') }}</p>
          <p class="corp-note">{{ $t('corpNote1') }}</p>
          <ul class="corp-list">
            <li
              v-for="doc in documents"
              :key="doc"
            >
              {{ $t(doc) }}
            </li>
          </ul>

          <p class="corp-lead">{{ $t('corpLead2') }}</p>
          <ul class="corp-list">
            <li
              v-for="doc in investorDocuments"
              :key="doc"
            >
              {{ $t(doc) }}
            </li>
          </ul>
          <p class="corp-note">{{ $t('corpNote2') }} <a
            class="corp-link"
            href="https://www.elegislation.gov.hk/hk/cap571D"
            target="_blank"
            rel="noreferrer"
            >https://www.elegislation.gov.hk/hk/cap571D</a></p>

          <p class="corp-lead">{{ $t('corpLead3') }}</p>
          <div class="corp-files">
            <div
              v-for="file in files"
              :key="file"
              class="corp-file"
            >
              <svg
                class="corp-file-icon"
                viewBox="0 0 34 42"
                aria-hidden="true"
              >
                <path
                  d="M4 2h18l8 8v30H4z"
                  fill="#fff"
                  stroke="#d8dee8"
                  stroke-width="1.6"
                />
                <path
                  d="M22 2v8h8"
                  fill="#f1f4f8"
                  stroke="#d8dee8"
                  stroke-width="1.6"
                />
                <path
                  d="M8 16h12M8 21h12M8 26h8"
                  stroke="#e2e8ef"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <rect
                  x="0"
                  y="27"
                  width="22"
                  height="12"
                  rx="2"
                  fill="#e0443a"
                />
                <text
                  x="11"
                  y="36"
                  text-anchor="middle"
                  font-size="7.5"
                  font-weight="700"
                  fill="#fff"
                >
                  PDF
                </text>
              </svg>
              <div class="corp-file-text">
                <b>{{ $t(file) }}</b>
                <div class="corp-file-links"><a>{{ $t('corpPreview') }}</a><a>{{ $t('corpDownload') }}</a></div>
              </div>
            </div>
          </div>

          <p class="corp-mail">{{ $t('corpMail') }}</p>
          <p class="corp-note">{{ $t('corpResult') }}</p>

          <div class="person-actions">
            <a
              class="person-back"
              href="/bge/hk/zh-CN/user/kyc"
              >{{ $t('personBack') }}</a
            >
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.corp-hero {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 955px;
  min-height: 180px;
  padding: 44px 40px;
  background: linear-gradient(90deg, #fdf4e0, #fdf9ee 70%, #fefdf9);
  overflow: hidden;
}
.corp-hero-text b {
  display: block;
  color: #d9a600;
  font-size: 21px;
  font-weight: 600;
}
.corp-hero-text span {
  display: block;
  margin-top: 14px;
  color: #8a8f99;
  font-size: 15px;
}
.corp-hero-art {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 330px;
  height: 172px;
}
.corp-lead {
  position: relative;
  max-width: 955px;
  margin: 0 0 16px;
  padding-left: 22px;
  color: #303744;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.9;
}
.corp-lead::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  width: 9px;
  height: 9px;
  background: #f0c518;
}
.corp-note {
  max-width: 955px;
  margin: 0 0 26px;
  color: #8a8f99;
  font-size: 13.5px;
  line-height: 1.9;
}
.corp-link {
  color: #d9a600;
  text-decoration: none;
}
.corp-link:hover {
  color: #b98c00;
}
.corp-list {
  max-width: 955px;
  margin: 0 0 34px;
  padding: 0;
  list-style: none;
}
.corp-list li {
  position: relative;
  padding-left: 20px;
  color: #3f4a56;
  font-size: 15px;
  line-height: 2.3;
}
.corp-list li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 15px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #c8ced8;
}
.corp-files {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 26px 40px;
  max-width: 955px;
  margin-bottom: 34px;
  padding: 30px 34px;
  border: 1px solid #e2e6ed;
  background: #fafbfc;
}
.corp-file {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.corp-file-icon {
  width: 34px;
  height: 42px;
  flex: 0 0 34px;
}
.corp-file-text b {
  display: block;
  margin-top: 4px;
  color: #303744;
  font-size: 14.5px;
  font-weight: 500;
}
.corp-file-links {
  display: flex;
  gap: 18px;
  margin-top: 12px;
}
.corp-file-links a {
  color: #d9a600;
  font-size: 13.5px;
  cursor: pointer;
}
.corp-file-links a:hover {
  color: #b98c00;
}
.corp-mail {
  max-width: 955px;
  margin: 0 0 12px;
  color: #171d27;
  font-size: 15px;
  font-weight: 600;
}
</style>
