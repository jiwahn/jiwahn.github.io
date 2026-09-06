---
title: 42 Seoul
layout: project
project: true
lang: ko
tags: [42 Seoul, C programming, C++, system-programming, networking, operating-systems, concurrency]
eyebrow: "Systems programming · 42 Seoul"
lead: "C/C++ 기반 Unix 시스템·네트워크·운영체제·동시성 프로젝트"
---

{% assign projects = site.data.projects | where: 'group', '42seoul' %}
<div class="project-list project-collection">
  {% for project in projects %}
  {% include project-card.html project=project number=forloop.index %}
  {% endfor %}
</div>
