import { main } from './dist/index';

const clear = () => {
    document.body.innerHTML = '';
    main()
}

main()