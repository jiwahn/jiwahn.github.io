---
title: "42 Seoul Projects"
back_link: /
tags:
  - 42 Seoul
  - C programming
  - C++
  - system-programming
  - networking
  - operating-systems
  - concurrency
---

# 42 Seoul Projects

42 Seoul 과정에서 C와 C++로 Unix 시스템, 네트워크, 동시성, 운영체제를 직접 구현했습니다. 아래는 문제를 설계와 코드로 풀어낸 주요 프로젝트입니다.

<div class="project-grid">
  <a class="project-jump" href="#ft_irc">
    <span>Network server</span>
    <strong>ft_irc</strong>
    <small>C++ · 3-person team</small>
  </a>
  <a class="project-jump" href="#minishell">
    <span>Unix shell</span>
    <strong>minishell</strong>
    <small>C · 2-person team</small>
  </a>
</div>

## Featured projects

<article class="project-card" id="ft_irc">
  <div class="project-card__heading">
    <div>
      <p class="eyebrow">Network server · C++ · 3-person team</p>
      <h3>ft_irc</h3>
      <p class="project-summary">여러 클라이언트가 채널에서 대화할 수 있는 IRC 서버를 C++로 구현했습니다.</p>
    </div>
    <a class="project-link" href="https://github.com/jiwahn/ft_irc">View code ↗</a>
  </div>

  <div class="project-details">
    <section>
      <h4>What I built</h4>
      <ul>
        <li>TCP 서버 소켓의 생성부터 연결 수락까지의 흐름을 구현했습니다.</li>
        <li>I/O 다중화로 여러 클라이언트 연결을 한 서버 프로세스에서 처리했습니다.</li>
        <li>사용자, 채널, 권한을 서버 상태로 관리하고 IRC 명령과 응답을 처리했습니다.</li>
      </ul>
    </section>
    <section>
      <h4>Key challenge</h4>
      <p>TCP는 메시지 단위가 아닌 스트림으로 데이터를 전달합니다. 한 번의 <code>recv()</code>가 완전한 IRC 명령 하나를 보장하지 않기 때문에, 연결마다 버퍼를 유지하고 완성된 메시지만 파싱하도록 설계했습니다.</p>
    </section>
    <section>
      <h4>What I learned</h4>
      <p>소켓도 파일 디스크립터로 관리된다는 Unix I/O 모델과, 애플리케이션 계층 프로토콜을 규격에 맞춰 구현하는 과정을 경험했습니다.</p>
    </section>
  </div>

  <div class="tech-list" aria-label="ft_irc technologies">
    <span>C++</span><span>TCP sockets</span><span>I/O multiplexing</span><span>IRC protocol</span><span>STL</span>
  </div>
</article>

<article class="project-card" id="minishell">
  <div class="project-card__heading">
    <div>
      <p class="eyebrow">Unix shell · C · 2-person team</p>
      <h3>minishell</h3>
      <p class="project-summary">Bash의 핵심 동작을 재현하며 명령 해석부터 프로세스 실행까지 구현한 작은 Unix shell입니다.</p>
    </div>
    <a class="project-link" href="https://github.com/jiwahn/minishell">View code ↗</a>
  </div>

  <div class="project-details">
    <section>
      <h4>What I built</h4>
      <ul>
        <li>입력 명령을 토큰화하고 명령어, 인자, 파이프, 리다이렉션 구조로 해석했습니다.</li>
        <li><code>fork()</code>, <code>execve()</code>, <code>waitpid()</code>로 자식 프로세스의 생성·실행·회수를 구현했습니다.</li>
        <li><code>&lt;</code>, <code>&gt;</code>, <code>&gt;&gt;</code>, <code>&lt;&lt;</code>, 환경변수 확장, builtin, signal 처리를 지원했습니다.</li>
      </ul>
    </section>
    <section>
      <h4>Key challenge</h4>
      <p><code>ls | grep foo &gt; result.txt</code>처럼 파이프와 리다이렉션이 함께 있는 명령에서 프로세스마다 필요한 파일 디스크립터를 구성하고, 사용이 끝난 descriptor를 정확히 닫는 흐름을 구현했습니다.</p>
    </section>
    <section>
      <h4>What I learned</h4>
      <p>프로세스 생성부터 프로그램 교체, IPC, 종료 상태 회수까지 Unix 프로세스의 생명주기를 직접 다루며, 표준 입출력도 파일 디스크립터를 중심으로 연결된다는 구조를 이해했습니다.</p>
    </section>
  </div>

  <div class="tech-list" aria-label="minishell technologies">
    <span>C</span><span>Unix processes</span><span>Pipes</span><span>Redirection</span><span>Signals</span>
  </div>
</article>

## More systems projects

<div class="project-grid project-grid--compact">
  <article class="project-mini">
    <h3>philosophers</h3>
    <p>Dining Philosophers 문제를 <code>pthread</code>와 mutex로 구현하며 경쟁 상태와 교착 상태를 제어했습니다.</p>
    <div class="tech-list"><span>C</span><span>Threads</span><span>Mutex</span></div>
  </article>
  <article class="project-mini">
    <h3>KFS</h3>
    <p>멀티부트 기반 x86 커널에서 부팅, 페이징, VGA 출력, 키보드 I/O를 직접 구현했습니다.</p>
    <div class="tech-list"><span>C</span><span>Assembly</span><span>x86</span><span>Virtual memory</span></div>
  </article>
  <article class="project-mini">
    <h3>C foundations</h3>
    <p>Libft, ft_printf, get_next_line을 통해 메모리 관리, 가변 인자, 파일 디스크립터와 버퍼 상태 관리를 익혔습니다.</p>
    <div class="tech-list"><span>C</span><span>Memory management</span><span>File descriptors</span></div>
  </article>
  <article class="project-mini">
    <h3>C++ Modules</h3>
    <p>객체 수명, 상속과 다형성, 예외 처리, 템플릿과 STL을 학습하며 객체지향 설계로 확장했습니다.</p>
    <div class="tech-list"><span>C++</span><span>OOP</span><span>Templates</span><span>STL</span></div>
  </article>
</div>
