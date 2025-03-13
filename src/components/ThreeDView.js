import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "../styles/ThreeDView.css";
import {
  divider_thickness,
  frame_thickness,
  initialHeightsLeft,
  initialHeightsRight,
  shelfKeysLeft,
} from "../constants";

const ThreeDView = ({
  furnitureConfig,
  selectedComponent,
  onComponentSelect,
  hoveredComponent,
  onComponentHover,
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const doorRefs = useRef({});
  const drawerRef = useRef(null);
  const animationRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Hàm tạo hoạt ảnh cho cửa
  const animateDoor = useCallback((side, opening) => {
    const door = doorRefs.current[side];
    if (!door) return;

    // Xác định góc xoay mục tiêu dựa trên loại cửa và vị trí bản lề
    let targetRotation = 0;
    if (opening) {
      // Kiểm tra bản lề dựa trên cách đặt tên ID
      const isLeftHinge =
        (side.includes("Left") && !side.includes("Right")) ||
        side === "rightTopLeft" ||
        side === "rightBottomLeft";

      // Cửa có bản lề bên trái xoay ra ngoài theo chiều âm
      // Cửa có bản lề bên phải xoay ra ngoài theo chiều dương
      targetRotation = isLeftHinge ? -Math.PI / 4 : Math.PI / 4;
    }

    // Hủy animation hiện tại của cửa này nếu có
    if (door.userData.animationId) {
      cancelAnimationFrame(door.userData.animationId);
      door.userData.animationId = null;
    }

    // Nếu door đã ở gần vị trí mục tiêu, đặt trực tiếp vào vị trí đó
    if (Math.abs(door.rotation.y - targetRotation) < 0.05) {
      door.rotation.y = targetRotation;
      return;
    }

    // Xác định hướng xoay dựa trên vị trí bản lề và trạng thái mở/đóng
    const isLeftHinge =
      (side.includes("Left") && !side.includes("Right")) ||
      side === "rightTopLeft" ||
      side === "rightBottomLeft";

    // Cập nhật tốc độ và hướng animation
    const animate = () => {
      const speed = 0.04;

      // Xác định bước xoay dựa trên loại bản lề và trạng thái mở/đóng
      let step;
      if (opening) {
        step = isLeftHinge ? -speed : speed;
      } else {
        step = isLeftHinge ? speed : -speed;
      }

      // Kiểm tra xem animation đã hoàn thành chưa
      let isComplete;
      if (opening) {
        isComplete = isLeftHinge
          ? door.rotation.y <= targetRotation
          : door.rotation.y >= targetRotation;
      } else {
        isComplete = Math.abs(door.rotation.y) < 0.05;
      }

      if (!isComplete) {
        door.rotation.y += step;
        door.userData.animationId = requestAnimationFrame(animate);
      } else {
        door.rotation.y = targetRotation;
        door.userData.animationId = null;
      }
    };

    animate();
  }, []);

  // Hàm tạo hoạt ảnh cho ngăn kéo
  const animateDrawer = useCallback((opening) => {
    if (!drawerRef.current) return;

    // Xác định vị trí mục tiêu
    const targetPosition = opening ? 0.3 : 0; // Kéo ra 30cm khi mở

    // Hủy animation hiện tại nếu có
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Nếu ngăn kéo đã ở gần vị trí mục tiêu, đặt trực tiếp vào vị trí đó
    if (Math.abs(drawerRef.current.position.z - targetPosition) < 0.01) {
      drawerRef.current.position.z = targetPosition;
      return;
    }

    // Cập nhật tốc độ và hướng animation
    const animate = () => {
      const speed = 0.02;
      const step = opening ? speed : -speed;

      // Kiểm tra xem animation đã hoàn thành chưa
      const isComplete = opening
        ? drawerRef.current.position.z >= targetPosition
        : drawerRef.current.position.z <= targetPosition;

      if (!isComplete) {
        drawerRef.current.position.z += step;
        animationRef.current = requestAnimationFrame(animate);
      } else {
        drawerRef.current.position.z = targetPosition;
        animationRef.current = null;
      }
    };

    animate();
  }, []);

  // Hàm xử lý sự kiện mouse move
  const handleMouseMove = useCallback(
    (event) => {
      if (!rendererRef.current || !cameraRef.current) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

      // Lấy tất cả các mesh cửa và ngăn kéo để kiểm tra giao cắt
      const interactiveComponents = [];

      // Thêm cửa nếu có
      Object.keys(doorRefs.current).forEach((key) => {
        if (doorRefs.current[key]) {
          doorRefs.current[key].traverse((child) => {
            if (child.isMesh) {
              child.userData.type = "door";
              child.userData.id = key;
              interactiveComponents.push(child);
            }
          });
        }
      });

      // Thêm ngăn kéo nếu có
      if (drawerRef.current) {
        drawerRef.current.traverse((child) => {
          if (child.isMesh) {
            child.userData.type = "drawer";
            child.userData.id = "drawer";
            interactiveComponents.push(child);
          }
        });
      }

      const intersects = raycasterRef.current.intersectObjects(
        interactiveComponents
      );
      let hoveredComponentType = null;
      let hoveredComponentId = null;

      if (intersects.length > 0) {
        hoveredComponentType = intersects[0].object.userData.type;
        hoveredComponentId = intersects[0].object.userData.id;
      }

      // Đóng tất cả các cửa không được hover
      Object.keys(doorRefs.current).forEach((key) => {
        if (
          doorRefs.current[key] &&
          (hoveredComponentType !== "door" || hoveredComponentId !== key)
        ) {
          animateDoor(key, false);
        }
      });

      // Đóng ngăn kéo nếu không được hover
      if (
        drawerRef.current &&
        (hoveredComponentType !== "drawer" || hoveredComponentId !== "drawer")
      ) {
        animateDrawer(false);
      }

      // Mở thành phần đang được hover
      if (hoveredComponentType === "door" && hoveredComponentId) {
        animateDoor(hoveredComponentId, true);
        if (onComponentHover) {
          onComponentHover(hoveredComponentId);
        }
      } else if (hoveredComponentType === "drawer" && hoveredComponentId) {
        animateDrawer(true);
        if (onComponentHover) {
          onComponentHover(hoveredComponentId);
        }
      } else {
        if (onComponentHover) {
          onComponentHover(null);
        }
      }
    },
    [animateDoor, animateDrawer, onComponentHover]
  );

  // Hàm xử lý sự kiện click
  const handleClick = useCallback(
    (event) => {
      if (!rendererRef.current || !cameraRef.current) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

      // Get all interactive components
      const interactiveComponents = [];

      // Add doors
      Object.keys(doorRefs.current).forEach((key) => {
        if (doorRefs.current[key]) {
          doorRefs.current[key].traverse((child) => {
            if (child.isMesh) {
              child.userData.type = "door";
              child.userData.id = key;
              interactiveComponents.push(child);
            }
          });
        }
      });

      // Add drawer
      if (drawerRef.current) {
        drawerRef.current.traverse((child) => {
          if (child.isMesh) {
            child.userData.type = "drawer";
            child.userData.id = "drawer";
            interactiveComponents.push(child);
          }
        });
      }

      const intersects = raycasterRef.current.intersectObjects(
        interactiveComponents
      );

      if (intersects.length > 0 && onComponentSelect) {
        onComponentSelect(intersects[0].object.userData.id);
      }
    },
    [onComponentSelect]
  );

  // Khởi tạo scene, camera, renderer
  useEffect(() => {
    if (!mountRef.current) return;

    // Lưu tham chiếu đến mount element để tránh vấn đề với cleanup function
    const mountElement = mountRef.current;

    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mountElement.clientWidth / mountElement.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountElement.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.5);
    scene.add(hemisphereLight);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (mountElement && cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect =
          mountElement.clientWidth / mountElement.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(
          mountElement.clientWidth,
          mountElement.clientHeight
        );
      }
    };

    window.addEventListener("resize", handleResize);

    // Clean up on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountElement && rendererRef.current) {
        mountElement.removeChild(rendererRef.current.domElement);
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Xây dựng tủ và thiết lập tương tác
  useEffect(() => {
    if (
      !sceneRef.current ||
      !cameraRef.current ||
      !rendererRef.current ||
      !mountRef.current
    )
      return;

    // Xóa tủ cũ nếu có
    const existingCabinet = sceneRef.current.getObjectByName("cabinet");
    if (existingCabinet) {
      sceneRef.current.remove(existingCabinet);
    }

    // Thiết lập lại các tham chiếu
    doorRefs.current = {};
    drawerRef.current = null;

    // Hủy event listeners cũ
    if (rendererRef.current.domElement) {
      rendererRef.current.domElement.removeEventListener(
        "mousemove",
        handleMouseMove
      );
      rendererRef.current.domElement.removeEventListener("click", handleClick);
    }

    // Get dimensions in meters for Three.js (converting from mm)
    const width = furnitureConfig?.dimensions?.width / 1000 || 1.7;
    const height = furnitureConfig?.dimensions?.height / 1000 || 2.3;
    const depth = furnitureConfig?.dimensions?.depth / 1000 || 0.608;

    // Thiết lập lại camera
    const cameraDistance = Math.max(width, height, depth) * 2.1;
    cameraRef.current.position.set(0, height / 2, cameraDistance);
    cameraRef.current.lookAt(0, height / 2, 0);

    // Thiết lập lại controls
    if (controlsRef.current) {
      controlsRef.current.minDistance = cameraDistance * 0.5;
      controlsRef.current.maxDistance = cameraDistance * 3;
      controlsRef.current.maxPolarAngle = Math.PI / 1.5;
      controlsRef.current.minPolarAngle = Math.PI / 6;
    }

    // Tạo tủ dựa theo mẫu trong hình
    const createCabinet = () => {
      const cabinetGroup = new THREE.Group();
      cabinetGroup.name = "cabinet";

      // Vật liệu
      const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5f5dc,
        transparent: furnitureConfig?.options?.caisson !== false,
        opacity: furnitureConfig?.options?.caisson !== false ? 0.8 : 1,
      });

      const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
      const drawerMaterial = new THREE.MeshStandardMaterial({
        color: 0xc0c0c0,
      });
      const handleMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
      });

      // Khung tủ
      if (furnitureConfig?.options?.caisson !== false) {
        // Các thành phần bên ngoài
        const frameThickness = frame_thickness / 1000; // 18mm thickness

        // Mặt sau
        if (furnitureConfig?.options?.fond !== false) {
          const backPanel = new THREE.Mesh(
            new THREE.BoxGeometry(width - 0.01, height - 0.01, 0.008),
            frameMaterial
          );
          backPanel.position.set(0, height / 2, -depth / 2 + 0.004);
          cabinetGroup.add(backPanel);
        }

        // Thành bên trái
        const leftSide = new THREE.Mesh(
          new THREE.BoxGeometry(frameThickness, height, depth),
          frameMaterial
        );
        leftSide.position.set(-width / 2 + frameThickness / 2, height / 2, 0);
        cabinetGroup.add(leftSide);

        // Thành bên phải
        const rightSide = new THREE.Mesh(
          new THREE.BoxGeometry(frameThickness, height, depth),
          frameMaterial
        );
        rightSide.position.set(width / 2 - frameThickness / 2, height / 2, 0);
        cabinetGroup.add(rightSide);

        // Thành trên
        const topSide = new THREE.Mesh(
          new THREE.BoxGeometry(width, frameThickness, depth),
          frameMaterial
        );
        topSide.position.set(0, height - frameThickness / 2, 0);
        cabinetGroup.add(topSide);

        // Thành dưới
        const bottomSide = new THREE.Mesh(
          new THREE.BoxGeometry(width, frameThickness, depth),
          frameMaterial
        );
        bottomSide.position.set(0, frameThickness / 2, 0);
        cabinetGroup.add(bottomSide);
      }

      // Ngăn chia giữa (vertical divider)
      const dividerThickness = divider_thickness / 1000;
      const vDivider = new THREE.Mesh(
        new THREE.BoxGeometry(dividerThickness, height - 0.036, depth - 0.02),
        shelfMaterial
      );
      vDivider.position.set(0, height / 2, 0);
      cabinetGroup.add(vDivider);

      // Các kệ bên trái (6 kệ tạo 7 ngăn)
      const leftWidth = width / 2 - (1.5 * frame_thickness) / 1000;
      const shelfHeight = 0.036;

      // Tính toán vị trí y của các kệ từ trên xuống
      const topPosition = height - frame_thickness / 1000; // Vị trí khung trên cùng
      let currentPositionLeft = topPosition;

      // Mảng lưu trữ vị trí của các kệ (từ trên xuống)
      const shelfPositions = [];
      // Tính vị trí tất cả các kệ bằng vòng lặp
      shelfKeysLeft.forEach((key) => {
        currentPositionLeft -= initialHeightsLeft[key] / 1000; // Chuyển từ mm sang m
        shelfPositions.push(currentPositionLeft);
      });

      // Ngăn bottom3 không cần kệ sau nó vì đáy tủ đã đóng vai trò đó

      // Tạo các kệ tại các vị trí đã tính
      for (let i = 0; i < shelfPositions.length; i++) {
        // Độ dày kệ - kệ thứ 4 (index 3) có độ dày 18mm, các kệ khác có độ dày 36mm
        const currentShelfHeight = i === 3 ? 0.018 : shelfHeight;
        const shelf = new THREE.Mesh(
          new THREE.BoxGeometry(leftWidth, currentShelfHeight, depth - 0.02),
          shelfMaterial
        );
        shelf.position.set(
          -leftWidth / 2 - dividerThickness / 2,
          shelfPositions[i],
          0
        );
        cabinetGroup.add(shelf);
      }

      // Ngăn kéo (ở vị trí thứ 4 từ trên xuống)
      if (furnitureConfig?.options?.portes !== false) {
        const drawerHeight = 0.15; // Chiều cao ngăn kéo 15cm
        const drawerWidth = leftWidth - 0.02;
        const drawerDepth = depth - 0.04;

        // Tính vị trí ngăn kéo dựa trên vị trí của kệ thứ 3 và thứ 4
        // Kệ thứ 3 là shelfPositions[2], kệ thứ 4 là shelfPositions[3]
        // Ngăn kéo sẽ nằm giữa hai kệ này
        const drawerY = (shelfPositions[2] + shelfPositions[3]) / 2;

        // Ngăn kéo
        const drawerGroup = new THREE.Group();
        drawerGroup.name = "drawer";

        // Thân ngăn kéo
        const drawerBox = new THREE.Mesh(
          new THREE.BoxGeometry(drawerWidth, drawerHeight, drawerDepth),
          drawerMaterial
        );
        drawerBox.position.set(0, 0, 0);
        drawerGroup.add(drawerBox);

        // Tay nắm ngăn kéo
        const handle = new THREE.Mesh(
          new THREE.BoxGeometry(drawerWidth / 2, 0.02, 0.02),
          handleMaterial
        );
        handle.position.set(0, 0, drawerDepth / 2 + 0.01);
        drawerGroup.add(handle);

        // Vị trí ngăn kéo
        drawerGroup.position.set(
          -leftWidth / 2 - dividerThickness / 2,
          drawerY,
          0
        );
        cabinetGroup.add(drawerGroup);

        // Lưu tham chiếu ngăn kéo
        drawerRef.current = drawerGroup;
      } else {
        // Nếu portes bằng false, đặt drawerRef.current thành null
        drawerRef.current = null;
      }

      // Các kệ bên phải
      const rightWidth = width / 2 - ((3 / 2) * frame_thickness) / 1000;
      const frameThickness = frame_thickness / 1000; // 18mm

      // Tính toán vị trí y của các kệ từ trên xuống
      let currentPositionRight = topPosition;
      // Chiều cao các ngăn bên phải
      const heightsRight = initialHeightsRight;

      // Mảng lưu trữ vị trí của các kệ bên phải
      const rightShelfPositions = [];

      // Tính vị trí các kệ bên phải
      // Kệ 1 (sau ngăn top)
      currentPositionRight -= heightsRight.top / 1000;
      rightShelfPositions.push(currentPositionRight);

      // Kệ 2 (sau ngăn middle1)
      currentPositionRight -= heightsRight.middle1 / 1000;
      rightShelfPositions.push(currentPositionRight);

      // Kệ 3 (sau ngăn middle2)
      currentPositionRight -= heightsRight.middle2 / 1000;
      rightShelfPositions.push(currentPositionRight);

      // Ngăn bottom không cần thêm kệ vì đáy tủ sẽ đóng vai trò đó

      // Tạo các kệ bên phải tại các vị trí đã tính
      for (let i = 0; i < rightShelfPositions.length; i++) {
        const shelf = new THREE.Mesh(
          new THREE.BoxGeometry(rightWidth, shelfHeight, depth - 0.02),
          shelfMaterial
        );
        shelf.position.set(
          rightWidth / 2 + dividerThickness / 2,
          rightShelfPositions[i],
          0
        );
        cabinetGroup.add(shelf);
      }

      // Tạo cửa nếu tùy chọn portes được bật
      if (furnitureConfig?.options?.portes) {
        // Tính toán kích thước cửa
        const doorThickness = 0.02;

        // Hàm tạo cửa - với tham số cabinetGroup truyền vào
        const createDoor = (width, height, x, y, z, side, parentGroup) => {
          const doorMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
          });

          // Tạo bản lề (pivot) trước
          const pivot = new THREE.Group();

          // Xác định vị trí bản lề dựa vào ID của cửa
          let pivotX = x;

          // Cửa bên trái tủ - bản lề trái
          if (side.startsWith("left") && side.endsWith("Left")) {
            pivotX = x - width / 2; // Đặt bản lề ở mép trái của cửa
          }
          // Cửa bên trái tủ - bản lề phải
          else if (side.startsWith("left") && side.endsWith("Right")) {
            pivotX = x + width / 2; // Đặt bản lề ở mép phải của cửa
          }
          // Cửa bên phải tủ - bản lề trái
          else if (side.startsWith("right") && side.endsWith("Left")) {
            pivotX = x - width / 2; // Đặt bản lề ở mép trái của cửa
          }
          // Cửa bên phải tủ - bản lề phải
          else if (side.startsWith("right") && side.endsWith("Right")) {
            pivotX = x + width / 2; // Đặt bản lề ở mép phải của cửa
          }

          // Đặt vị trí pivot tại điểm bản lề
          pivot.position.set(pivotX, y, z);

          // Tạo nhóm cửa
          const doorGroup = new THREE.Group();
          doorGroup.name = side;

          // Thân cửa
          const door = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, doorThickness),
            doorMaterial
          );

          // Tính offset của cửa so với bản lề
          let doorOffsetX = 0;
          if (side.endsWith("Left")) {
            doorOffsetX = width / 2; // Cửa bản lề trái, dịch sang phải
          } else if (side.endsWith("Right")) {
            doorOffsetX = -width / 2; // Cửa bản lề phải, dịch sang trái
          }

          // Đặt vị trí cửa so với pivot
          door.position.set(doorOffsetX, 0, doorThickness / 2);

          // Tay nắm (dạng thanh dọc)
          const handleGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.15);
          const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
          });
          const handle = new THREE.Mesh(handleGeometry, handleMaterial);

          // Xoay tay nắm để nó dọc
          handle.rotation.z = 0;

          // Vị trí tay nắm
          let handleOffsetX;
          if (side === "leftTopLeft" || side === "leftBottomLeft") {
            // Tay nắm cho cửa bên trái, đặt ở mép phải
            handleOffsetX = width - 0.03;
          } else if (side === "leftTopRight" || side === "leftBottomRight") {
            // Tay nắm cho cửa bên phải, đặt ở mép trái
            handleOffsetX = -width + 0.03;
          } else if (side === "rightTopRight" || side === "rightBottomRight") {
            // Tay nắm cho cửa phải bên phải
            handleOffsetX = -width + 0.03;
          } else if (side === "rightTopLeft" || side === "rightBottomLeft") {
            // Tay nắm cho cửa trái bên phải
            handleOffsetX = width - 0.03;
          }

          // Điều chỉnh vị trí theo chiều dọc và chiều sâu
          handle.position.set(handleOffsetX, 0, doorThickness + 0.006);

          // Thêm bóng cho cửa
          door.castShadow = true;
          door.receiveShadow = true;
          handle.castShadow = true;

          // Thêm vào nhóm
          doorGroup.add(door);
          doorGroup.add(handle);
          pivot.add(doorGroup);
          parentGroup.add(pivot);

          return pivot;
        };

        // Tính toán chiều cao và vị trí cho cửa trên bên trái(bao phủ 2 ngăn trên cùng)
        const topLeftDoorsHeight =
          (initialHeightsLeft.top +
            initialHeightsLeft.middle1 +
            frame_thickness +
            divider_thickness) /
          1000;
        console.log("topLeftDoorsHeight", topLeftDoorsHeight);
        const topLeftDoorsY = height - topLeftDoorsHeight / 2;

        // Chiều cao cửa dưới
        const bottomLeftDoorsHeight =
          shelfPositions[4] + (frame_thickness + divider_thickness) / 1000;

        // Vị trí Y của cửa là điểm giữa
        const bottomLeftDoorsY =
          frame_thickness / 1000 + bottomLeftDoorsHeight / 2;

        // Tính chiều rộng cho mỗi cửa (một nửa chiều rộng ban đầu)
        const doorWidthLeft =
          (leftWidth + (3 / 2) * (frame_thickness / 1000)) / 2;

        // Tạo hai cửa trên bên trái
        const leftTopLeftDoor = createDoor(
          doorWidthLeft, // Chiều rộng của cửa
          topLeftDoorsHeight, // Chiều cao của cửa
          -leftWidth / 2 - doorWidthLeft / 2, // Vị trí x của cửa trái
          topLeftDoorsY, // Vị trí y
          depth / 2, // Vị trí z
          "leftTopLeft", // ID cho cửa trái
          cabinetGroup
        );

        const leftTopRightDoor = createDoor(
          doorWidthLeft, // Chiều rộng của cửa
          topLeftDoorsHeight, // Chiều cao của cửa
          -leftWidth / 2 + doorWidthLeft / 2, // Vị trí x của cửa phải
          topLeftDoorsY, // Vị trí y
          depth / 2, // Vị trí z
          "leftTopRight", // ID cho cửa phải
          cabinetGroup
        );

        // Cửa bên trái dưới (bao phủ 2 ngăn dưới)
        const leftBottomLeftDoor = createDoor(
          doorWidthLeft,
          bottomLeftDoorsHeight,
          -leftWidth / 2 - doorWidthLeft / 2,
          bottomLeftDoorsY,
          depth / 2,
          "leftBottomLeft",
          cabinetGroup
        );

        const leftBottomRightDoor = createDoor(
          doorWidthLeft,
          bottomLeftDoorsHeight,
          -leftWidth / 2 + doorWidthLeft / 2,
          bottomLeftDoorsY,
          depth / 2,
          "leftBottomRight",
          cabinetGroup
        );

        // Tính toán chiều cao và vị trí cho cửa trên bên phải (bao phủ 2 ngăn trên cùng)
        const topRightDoorsHeight =
          (initialHeightsRight.top +
            initialHeightsRight.middle1 +
            initialHeightsRight.middle2 +
            frame_thickness +
            divider_thickness / 2) /
          1000;

        const topRightDoorsY = height - topRightDoorsHeight / 2;

        // Chiều cao cửa dưới bên phải

        const bottomRightDoorsHeight =
          (initialHeightsRight.bottom +
            frame_thickness +
            2.5 * divider_thickness) /
          1000;

        // Vị trí Y của cửa dưới bên phải
        const bottomRightDoorsY =
          frame_thickness / 1000 + bottomRightDoorsHeight / 2;

        // Tính chiều rộng cho mỗi cửa (một nửa chiều rộng ban đầu)
        const doorWidthRight = rightWidth / 2;

        // Tạo cửa trên bên phải
        const rightTopRightDoor = createDoor(
          doorWidthRight + frameThickness,
          topRightDoorsHeight,
          rightWidth / 2 + doorWidthRight / 2, // Vị trí x đặt ở phía phải của tủ
          topRightDoorsY, // Sử dụng topRightDoorsY không chia 2
          depth / 2,
          "rightTopRight",
          cabinetGroup
        );
        const rightTopLeftDoor = createDoor(
          doorWidthRight,
          topRightDoorsHeight,
          rightWidth / 2 - doorWidthRight / 2, // Vị trí x đặt ở phía phải của tủ
          topRightDoorsY, // Sử dụng topRightDoorsY không chia 2
          depth / 2,
          "rightTopLeft",
          cabinetGroup
        );

        // Tạo cửa dưới bên phải
        const rightBottomRightDoor = createDoor(
          doorWidthRight + frameThickness,
          bottomRightDoorsHeight,
          rightWidth / 2 + doorWidthRight / 2, // Vị trí x đặt ở phía phải của tủ
          bottomRightDoorsY, // Sử dụng topRightDoorsY không chia 2
          depth / 2,
          "rightTopRight",
          cabinetGroup
        );
        const rightBottomLeftDoor = createDoor(
          doorWidthRight,
          bottomRightDoorsHeight,
          rightWidth / 2 - doorWidthRight / 2, // Vị trí x đặt ở phía phải của tủ
          bottomRightDoorsY, // Sử dụng topRightDoorsY không chia 2
          depth / 2,
          "rightTopLeft",
          cabinetGroup
        );

        // Lưu tham chiếu cửa
        doorRefs.current = {
          leftTopLeft: leftTopLeftDoor,
          leftTopRight: leftTopRightDoor,
          leftBottomLeft: leftBottomLeftDoor,
          leftBottomRight: leftBottomRightDoor,
          rightTopRight: rightTopRightDoor,
          rightTopLeft: rightTopLeftDoor,
          rightBottomRight: rightBottomRightDoor,
          rightBottomLeft: rightBottomLeftDoor,
        };
      }

      return cabinetGroup;
    };

    // Add cabinet to scene
    const cabinet = createCabinet();
    sceneRef.current.add(cabinet);

    // Thêm event listeners mới
    rendererRef.current.domElement.addEventListener(
      "mousemove",
      handleMouseMove
    );
    rendererRef.current.domElement.addEventListener("click", handleClick);

    // Set initialized flag
    setIsInitialized(true);

    // Clean up
    return () => {
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.removeEventListener(
          "mousemove",
          handleMouseMove
        );
        rendererRef.current.domElement.removeEventListener(
          "click",
          handleClick
        );
      }
    };
  }, [furnitureConfig, handleClick, handleMouseMove]);

  // Phản ứng với thay đổi trong hoveredComponent
  useEffect(() => {
    if (!isInitialized) return;

    // Nếu có hoveredComponent từ bên ngoài, mở cửa hoặc ngăn kéo tương ứng
    if (hoveredComponent) {
      if (doorRefs.current[hoveredComponent]) {
        animateDoor(hoveredComponent, true);
      } else if (hoveredComponent === "drawer" && drawerRef.current) {
        animateDrawer(true);
      }
    }
  }, [hoveredComponent, isInitialized, animateDoor, animateDrawer]);

  return <div className="three-d-view" ref={mountRef}></div>;
};

export default ThreeDView;
